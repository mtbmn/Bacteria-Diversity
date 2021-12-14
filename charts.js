function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select('#selDataset');

  // Use the list of sample names to populate the select options
  d3.json('samples.json').then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append('option')
        .text(sample)
        .property('value', sample);
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
  d3.json('samples.json').then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select('#sample-metadata');

    // Use `.html('') to clear any existing metadata
    PANEL.html('');

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append('h3').text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json('samples.json').then((data) => {
    // 3. Create a variable that holds the samples array. 
    const samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    // 5. Create a variable that holds the first sample in the array.
    const firstSample = samples.filter(s => s.id === sample)[0];


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    const ids = firstSample.otu_ids;
    const labels = firstSample.otu_labels
      // extra code to make the hover text multiline and thus more manageable
      .map(lab => lab.split(';').join('<br>'));
    const values = firstSample.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    const topIds = ids
      .slice(0, 10)
      .map(val => 'OTU ' + val)
      .reverse();
    const topLabels = labels
      .slice(0, 10)
      .reverse();
    const topValues = values
      .slice(0, 10)
      .map(val => parseInt(val))
      .reverse();

    var yticks = topIds;

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: topValues,
      y: topIds,
      type: 'bar',
      orientation: 'h',
      text: topLabels,
      marker: {
        color: 'yellowgreen'
      }
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: '<b>Top 10 Bacteria Cultures Found</b>',
      yaxis: { tickvals: yticks },
      margin: { l:80, r: 25, t: 50, b: 25},
      plot_bgcolor: '#403c36',
      paper_bgcolor: '#403c36',
      gridcolor: '#f7f2eb',
      font: {
        color: '#f7f2eb'
      },
      yaxis: {
        tickcolor: '#c7b5a3',
        gridcolor: '#c7b5a3',
        zerolinecolor: '#c7b5a3'
      },
      xaxis: {
        tickcolor: '#c7b5a3',
        gridcolor: '#c7b5a3',
        zerolinecolor: '#c7b5a3'
      }
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);


    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: ids,
      y: values,
      text: labels,
      mode: 'markers',
      marker: {
        size: values,
        color: ids,
        colorscale: 'Earth'
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: '<b>Bacteria Cultures per Sample</b>',
      hovermode:'closest',
      margin: { l:50, r: 25, t: 50, b: 50},
      plot_bgcolor: '#403c36',
      paper_bgcolor: '#403c36',
      gridcolor: '#f7f2eb',
      font: {
        color: '#f7f2eb'
      },
      yaxis: {
        tickcolor: '#c7b5a3',
        gridcolor: '#c7b5a3',
        zerolinecolor: '#c7b5a3'
      },
      xaxis: {
        title: 'OTU ID',
        tickcolor: '#c7b5a3',
        gridcolor: '#c7b5a3',
        zerolinecolor: '#c7b5a3'
      }
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    // 2. Create a variable that holds the first sample in the array.
    const firstMeta = data.metadata.filter(m => m.id === parseInt(sample))[0];  

    // 3. Create a variable that holds the washing frequency.
    const wash = parseFloat(firstMeta.wfreq);
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wash,
      type:'indicator',
      mode: 'gauge+number',
      title: '<b>Bellybutton Washing Frequency</b><br>Scrubs per Week',
      gauge: {
        axis: { range: [0, 10], tickcolor: '#f7f2eb', tickwidth: 2 },
        steps: [
          { range: [0, 2], color: 'steelblue' },
          { range: [2, 4], color: 'turquoise' },
          { range: [4, 6], color: 'greenyellow' },
          { range: [6, 8], color: 'peru' },
          { range: [8, 10], color: 'tan' },
        ],
        bar: { color: 'white' },
      },
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      margin: { l: 25, r: 25, t: 50, b: 10 },
      plot_bgcolor: '#403c36',
      paper_bgcolor: '#403c36',
      font: {
        color: '#f7f2eb'
      }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });

}

window.onresize = function() {
  let sample = d3.select('#selDataset').property('value');
  buildMetadata(sample);
  buildCharts(sample);
}
