// Store url in constant to be used by all functions
const CONST_URL = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';

function wrapperBuildDashboard(newSample='940') {

  // alert(newSample);

  // main function that process the json file
  d3.json(CONST_URL).then((data) => {

    // if calling for the first time newSample will be undefined
    // set it to the first id in names
    if (newSample === undefined) {
      newSample = data.names[0];
    }
    // alert(newSample);

    // filter data sets for use in dashboad functions
    
    // metadata filter
    let demographic_info = data.metadata;
    let demographic_results = demographic_info.filter(id => id.id == newSample);
console.log(demographic_results);
    // Get the samples field
    let samples_set = data.samples;

    // Filter the samples for the object with the desired sample number
    let sample_results = samples_set.filter(id=>id.id == sample);
    let first_sample_result = sample_results[0];

    // Get the otu_ids, otu_labels, and sample_values
    // data elements for barchart, bubble chart, and guage
    let first_ten_samples = first_result.sample_values.slice(0,10);
    let otu_ids = first_result.otu_ids.slice(0,10);
    let otu_labels = first_result.otu_labels.slice(0,10);
    
    
    
    
    buildDemographicInfoPanel(demographic_results);
    buildBarChart(first_ten_samples, otu_ids, otu_labels);
    buildBubbleChart(first_ten_samples, otu_ids, otu_labels);

  });

};

function buildBubbleChart(newFirstTenSamples, newOtuIds, newOtuLabels) {

  let trace = {
    x:newOtuIds,
    y:newFirstTenSamples,
    text: newOtuLabels,
    mode: 'markers',
    marker: {
      size:newFirstTenSamples,
      color:newOtuIds,
      colorscale: 'Earth'
    }
  };

  let data = [trace];

  let layout = {
    title: {
      text:'<b>Bacteria Cultures Per Sample</b>',
      font:{size:16, color:'black'}
    },
    hovermode: 'closest',
    paper_bgcolor: 'pink',
    xaxis:{title: 'OTU ID'},
    yaxis: {title: 'Number of Bacteria'}
  };

  Plotly.newPlot('bubble', data, layout);

};

function buildBarChart(newFirstTenSamples, newOtuIds, newOtuLabels) {
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barchart_data = [{
      x: newFirstTenSamples.reverse(),
      y:newOtuIds.map(x => `OTU ${x}`).reverse(),
      text:newOtuLabels.reverse(),
      type: 'bar',
      orientation: 'h'
    }];

    // Render the Bar Chart
    let barchart_layout = {
      title: '<b>Top 10 OYUs Found</b>',
      font:{
            size: 16,
            color: 'black'
           }
    };

    Plotly.newPlot('bar', barchart_data, barchart_layout);

};


function buildDemographicInfoPanel(newResults) {

  // Get first result in results by sample
  let first_result = newResults[0];
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
  
};



function init() {

  d3.json(CONST_URL).then((data) => {

    let demographic_info = data.metadata;
    let demographic_results = demographic_info.filter(id => id.id == '940');

    let samples_set = data.samples;
    let sample_results = samples_set.filter(id=>id.id == '940');


    console.log(demographic_results);
    console.log(sample_results);


  });

}


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
function buildCharts(sample) {

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


    // Build a Bubble Chart


    // Render the Bubble Chart


    // For the Bar Chart, map the otu_ids to a list of strings for your yticks


    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barchart_data = [{
      x: first_ten_samples.reverse(),
      y:otu_ids.map(x => `OTU ${x}`).reverse(),
      text:otu_labels.reverse(),
      type: 'bar',
      orientation: 'h'
    }];

    // Render the Bar Chart
    let barchart_layout = {
      title: '<b>Top 10 OYUs Found</b>',
      font:{
            size: 16,
            color: 'black'
           }
    };

    Plotly.newPlot('bar', barchart_data, barchart_layout);

  });
}

// Function to run on page load
function zz_init() {
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
    buildCharts(first_sample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  
  // Generate 
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
