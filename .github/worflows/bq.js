const bigqueryDataTransfer = require('@google-cloud/bigquery-data-transfer');
const client = new bigqueryDataTransfer.v1.DataTransferServiceClient();

async function quickstart() {
    const projectId = await client.getProjectId();
  
    // Iterate over all elements.
    const formattedParent = client.projectPath(projectId, 'us-central1');
    let nextRequest = {parent: formattedParent};
    const options = {autoPaginate: false};
    console.log('Data sources:');
    do {
      // Fetch the next page.
      const responses = await client.listDataSources(nextRequest, options);
      // The actual resources in a response.
      const resources = responses[0];
      // The next request if the response shows that there are more responses.
      nextRequest = responses[1];
      // The actual response object, if necessary.
      // const rawResponse = responses[2];
      resources.forEach(resource => {
        console.log(`  ${resource.name}`);
      });
    } while (nextRequest);
  
    console.log('\n\n');
    console.log('Sources via stream:');
  
    client
      .listDataSourcesStream({parent: formattedParent})
      .on('data', element => {
        console.log(`  ${element.name}`);
      });
  }
  quickstart();
