const bigqueryDataTransfer = require('@google-cloud/bigquery-data-transfer');
const client = new bigqueryDataTransfer.v1.DataTransferServiceClient();

//list directories
const getDirectories = path =>
  readdirSync(path, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    //if name of the directory starts with dot, it will be ignored
    .filter(dirent => !dirent.name.startsWith('.'))
    .filter(dirent => containsDatasetFile(dirent.name))
    .map(dirent => dirent.name)
  ;
//get *.bqsql file names
const getBqsqlFilesNames = path =>
  readdirSync(path, { withFileTypes: true })
    .filter(dirent => !dirent.isDirectory())
    .filter(dirent => dirent.name.toLowerCase().endsWith('.bqsql'))
    .map(dirent => dirent.name)
    .sort()
  ;


async function quickstart() {
  try {

    const projectId = await client.getProjectId();
    // // Iterate over all elements.
    const formattedParent = client.projectPath(projectId, 'europe');
    // let nextRequest = { parent: formattedParent };
    // const options = { autoPaginate: false };
    // console.log('Data sources:');
    // do {
    //   // Fetch the next page.
    //   const responses = await client.listDataSources(nextRequest, options);
    //   // The actual resources in a response.
    //   const resources = responses[0];
    //   // The next request if the response shows that there are more responses.
    //   nextRequest = responses[1];
    //   // The actual response object, if necessary.
    //   // const rawResponse = responses[2];
    //   resources.forEach(resource => {
    //     console.log(`  ${resource.name}`);
    //   });
    // } while (nextRequest);

    // console.log('\n\n');
    // console.log('Sources via stream:');

    // client
    //   .listDataSourcesStream({ parent: formattedParent })
    //   .on('data', element => {
    //     console.log(`  ${element.name}`);
    //   });

    await client
      .createTransferConfig({
        parent: formattedParent,
        transferConfig: {
          destinationDatasetId: 'Business',
          displayName: 'test by API',
          params: {
            fields: 
              {query: { stringValue: 'SELECT A,B, C FROM Business.Customers'}},

            
            destination_table_name_template: 'Customers2',
            write_disposition: 'WRITE_TRUNCATE'
          },
          schedule: 'every 15 minutes',
          dataSourceId: "scheduled_query",
          disabled: false,
          datasetRegion: 'europe'
        }
      })
      ;

  } catch (e) { throw e; }
}

quickstart().catch(e => { throw e; });
