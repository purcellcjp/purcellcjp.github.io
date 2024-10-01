// Store url in constant to be used by all functions
const CONST_URL = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';

// Build the metadata panel
function buildMetadata(sample) {
  
  d3.json(CONST_URL).then((data) => {

    // get the metadata field
    let demographic_info = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let results = demographic_info.filter(id => id.id == sample);

    // Get first result in results by sample
    let first_result = results[0];
    console.log('first_result:', first_result);

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    panel.html('');

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    console.log('first_result:');
    console.log('---------');
    Object.entries(first_result).forEach(([key,value]) => {
      console.log(key,value);
      panel.append('h6').text(`${key.toLocaleUpperCase()}: ${value}`);
    });

  });

};

// function to build both charts
function wrapperBuildCharts(sample) {

  d3.json(CONST_URL).then((data) => {

    // Get the samples field
    let samples_set = data.samples;

    // Filter the samples for the object with the desired sample number
    let results = samples_set.filter(id=>id.id == sample);
    let first_result = results[0];

    // Get the otu_ids, otu_labels, and sample_values
    let first_ten_samples = first_result.sample_values.slice(0,10);
    let otu_ids = first_result.otu_ids.slice(0,10);
    let otu_labels = first_result.otu_labels.slice(0,10);

    console.log(first_ten_samples);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    buildBarChart(first_ten_samples, otu_ids, otu_labels);
    
    // Build Bar Chart
    buildBubbleChart(first_ten_samples, otu_ids, otu_labels);

  });
}

function buildBarChart(newFirstTenSamples, newOtuIds, newOtuLabels) {
  
  // console.log(newFirstTenSamples.reverse());


  // Build a Bar Chart
  // Don't forget to slice and reverse the input data appropriately
  let trace = {
    x: newFirstTenSamples.reverse(),
    y: newOtuIds.map(x => `OTU ${x}`).reverse(),
    text: newOtuLabels.reverse(),
    type: 'bar',
    orientation: 'h'
  };

  let data = [trace];

  // Render the Bar Chart
  let layout = {
    title: '<b>Top 10 Bacteria Cultures Found</b>',
    xaxis: {title: 'Number of Bacteria'},
    font: {size: 16, color: 'black'}
  };

  Plotly.newPlot('bar', data, layout);


};

function buildBubbleChart(newFirstTenSamples, newOtuIds, newOtuLabels) { 
  
  let trace = {
              x: newOtuIds,
              y: newFirstTenSamples,
              text: newOtuLabels,
              mode: 'markers',
              marker: {
                        size: newFirstTenSamples,
                        color: newOtuIds,
                        colorscale: 'sunset' //brwnyl
                      }
  };

  let data = [trace];

  let layout = {
                title: {
                        text: '<b>Bacteria Cultures Per Sample</b>',
                        font: {size:18, color:'black'}
                      },
                hovermode: 'closest',
                // paper_bgcolor: 'pink',
                xaxis: {title: 'OTU ID'},
                yaxis: {title: 'Number of Bacteria'}
  };

  Plotly.newPlot('bubble', data, layout);

};


// Function to run on page load
function init() {

  d3.json(CONST_URL).then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select('#selDataset');
    // dropdownMenu.html('');

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    dropdownMenu.selectAll('option')
      .data(names).enter()        
      .append('option')
      .attr('value', function(id) {return id;})
      .text(function(id) { return id;});

    // Get the first sample from the list
    first_sample = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(first_sample);
    wrapperBuildCharts(first_sample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  
  // Generate 
  buildMetadata(newSample);
  wrapperBuildCharts(newSample);
}

// Initialize the dashboard
init();
