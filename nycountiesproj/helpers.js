/* Mapping and Data Functions*/

function drawTable(DataObj){
  //Handle the input Data//
  var columns = censusVars;
  columns.unshift("id");
  var DataMatrix = [];
  for( var property in DataObj){
    listcopy = DataObj[property].slice();
    listcopy.unshift(property)
    DataMatrix.push(listcopy);
  }
  //Finish handling input Data
  var body = d3.select("body")             //Get the body  
                .style("background-color","#009999");
  var div = body.append("div").style("overflow-y","auto") //Create Main Div for data display
                              .style({"height":"230px","display":"inline-block"}); //make scrollable if long
  var table = div.append("table");
      table.attr("id","dataTable"); //create table inside our div//

  var tbody = table.append("tbody");//create the body of the table
  
  var tr = tbody.selectAll("tr").data(DataMatrix) //for each row of data make a row in table
            .enter().append("tr")
            .style("background-color",function(d,i){ return (i%2==0)? "#6699ff":"#6677ff"})
            .attr("id",function(d){return "row"+d[0]})
            

  var td = tr.selectAll("td").data(function(d){return d}).enter() //for each datum in the row
              .append("td").text(function(datum){return datum});
  
  var thead = table.append("thead")
  var trhead  = thead.append("tr");
      trhead.selectAll("td").data(columns).enter()
        .append("td")
        .text(function(d){return d});
}

function updateTable(DataObj,type){

  var columns = censusVars;
  columns.unshift("id");
  var DataMatrix = [];
  for( var property in DataObj){
    listcopy = DataObj[property].slice();
    for( var i=0; i < listcopy.length; i++){

      listcopy[i] = (type == 1)? dataMapping(type,DataObj,property,i).toFixed(5)
                                :dataMapping(type,DataObj,property,i);
    }
    listcopy.unshift(property)
    DataMatrix.push(listcopy);
  }

  d3.selectAll("#dataTable tr").data(DataMatrix).selectAll("td")
                              .data(function(d){return d})
                              .text(function(datum){return datum});
}

var dataMapping = function(type,data,key,index){
    if(type === 0)
        return 1*data[key][index];
    if(type===1)
        return 1*(data[key][index])/(data[key][totalOccupancy]);
}

var mapping =  function(type,data,key){
    if(type === 0)
        return 1*data[key][selectedIndex];
    if(type===1)
        return 1*(data[key][selectedIndex])/(data[key][totalOccupancy]);
  }



//Census data must be defined before use;
var getDomain = function(){
  var domain = [];
  for(key in censusData){
    domain.push( mapping(maptype,censusData,key) );
  }
  
  domain.sort(function(a,b){return a-b});
  var index=0;
  for(var i in domain){
    if(domain[i] == 0)
      index = i;
    else
      break;
  }//Here we want to eliminate zeros from destroying our color scheme 
   //So we remove them from the domain being mapped to colors

  return domain;
}
 
 //Census data must be defined before use;
 //This function returns our color maping function based on census data
 var getColorMapping = function(){
    var domain = getDomain();
    var color = d3.scale.quantile()
      .domain(domain)
      .range(colorRange);

      return color;
 }

 function buildLegend(list,maptype){
  var labelList = [];
  if(maptype ===0){
    for(var i = 0; i < list.length; i++){ 
        if(i ==0)
          labelList.push("x < " +Math.round(list[i]));
        if(i == list.length-1)
         labelList.push("x > " +Math.round(list[i]));
        else
         labelList.push(Math.round(list[i]) +" < x < " +Math.round(list[i+1]));

    }
  }
    if(maptype ===1){
     for(var i = 0; i < list.length; i++){ 
        if(i ==0)
          labelList.push("x < " + (100*list[i]).toFixed(3) +"%");
        if(i == list.length-1)
         labelList.push("x > " + (100*list[i]).toFixed(3) + "%");
        else
         labelList.push((list[i]*100).toFixed(3) +"%" +" < x < " + (100*list[i+1]).toFixed(3) + "%");

      }   
    }
  return labelList;
}