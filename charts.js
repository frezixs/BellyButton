function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
  
  // 1. Create the buildCharts function.
  function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((sampledata) => {
      // 3. Create a variable that holds the samples array. 
      var samplesArray = sampledata.samples;
      //console.log(sampledata);
    
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var samples = samplesArray.filter(sampleObj => sampleObj.id == sample);
      //console.log(samples)
      //  5. Create a variable that holds the first sample in the array.
  
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var sampleOTU_array = samples[0];
      var sampleOTU_ids = sampleOTU_array.otu_ids;
      //console.log(sampleOTU_ids);
      var sampleOTU_labels = sampleOTU_array.otu_labels;
      //console.log(sampleOTU_labels);
      var sampleSample_values = sampleOTU_array.sample_values;
      //console.log(sampleSample_values);
  
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
      var bacteriaAll = samples.sort((a ,b) => a.sample_values - b.sample_values).reverse();
      //console.log(bacteriaAll);
      var allBacteria = bacteriaAll[0];
      console.log(allBacteria)
      var OTU_ids_Ten = allBacteria.otu_ids.slice(0,10);
      var OTULabels_Ten = allBacteria.otu_labels.slice(0,10).reverse();
      var sampleValues_Ten = allBacteria.sample_values.slice(0, 10).reverse();
      
  
      var yticks = OTU_ids_Ten.map(num => "OTU" + num).reverse();
      console.log(yticks);
      console.log(sampleValues_Ten);
      console.log(OTULabels_Ten);
      //sampleValues_Ten.map(num => parseInt(num))
      //console.log(yticks);
      // 8. Create the trace for the bar chart. 
  
      var trace = {
        x: sampleValues_Ten,
        y: yticks,
        text: OTULabels_Ten,
        type: 'bar',
        orientation: 'h'
        };
  
      //var barData = [trace];
      // 9. Create the layout for the bar chart. 
      var barLayout = {
        title:  {text: "<b>Top Ten Bacteria Found</b>"},
        font: {family: "monospace"},
        height: 420,
        width: 480
      };
  
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot('bar', [trace], barLayout);
      
  
      // ----- challenge part 2 ------//
      // 1. Create the trace for the bubble chart.
      var  trace2 ={
        x: sampleOTU_ids,
        y: sampleSample_values,
        text: sampleOTU_labels,
        hoverformat: '<br><b>x</b>: %{x}<br>'+
                      '<br><b>y</b>: %{y}<br>'+
                      '<b>%{text}</b>',
        mode: 'markers',
        marker:{
          size: sampleSample_values,
          color: sampleOTU_ids,
        }
      };
      var bubbleData = [trace2];
  
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: {text:"<b>Bacteria Cultures Per Sample</b>"},
        showlegend: 'true',
        hovermode: 'closest',
        zeroline: false,
        xaxis: {
          title:"<b>Sample OTU IDs</b>"},
        height: 600, 
        width: 1150,
        font: {family: "monospace"},
      };
  
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot('bubble', bubbleData, bubbleLayout);
  
  
      // --------- Challenge Part 3 -------- //
      // D3: 1-3. Use Plotly to plot the data with the layout.
      var metaData_All = sampledata.metadata
      //console.log(metaData_All)
      var SampleMetaData = metaData_All.filter(sampleObj => sampleObj.id == sample);
      //console.log(SampleMetaData)
      //console.log(sampledata)
      // convert wash freq to floating point number
      sampleMetaData = SampleMetaData[0];
      wfreq = parseFloat(sampleMetaData.wfreq);
      console.log(wfreq);
  
      // 4. Create the trace for the gauge chart.
      var gaugeData = [
        {
          domain: {x:[0, 10], y:[0, 10]},
          value: wfreq,
          title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs Per Week"},
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: {range: [0, 10], tickcolor: "black"},
            bar: {color: "black"},
            steps: [
              {range: [0, 2], color: "red" },
              {range: [2, 4], color: "orange" },
              {range: [4, 6], color: "yellow" },
              {range: [6, 8], color: "green" },
              {range: [8, 10], color: "darkgreen" }
            ],
            threshold: {
              line: {color: "black", width: 4 },
              thickness: 0.75,
              value: wfreq
            }
          }
        }
       
      ];
      
      // 5. Create the layout for the gauge chart.
      var gaugeLayout = { 
        width: 480, height: 420, margin: { t: 10, b: 10, r: 5, l: 5},
        font: {family: "monospace"}
      };
  
      // 6. Use Plotly to plot the gauge data and layout.
    
      Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  
      });
  }