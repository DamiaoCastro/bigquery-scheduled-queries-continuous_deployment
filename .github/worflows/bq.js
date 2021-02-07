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

  const projectId = await client.getProjectId();

  const locations = ['europe', 'us'];
  for (const location of locations) {

    const request = {
      parent: `projects/${projectId}/locations/${location}`,
      dataSourceIds: ['scheduled_query']
    };
    console.log(JSON.stringify(request));

    const iterable = client.listTransferConfigsAsync(request, { autoPaginate: false });
    for await (const response of iterable) {
      console.log(JSON.stringify(response));
    }

  }

  // await client
  //   .createTransferConfig({
  //     parent: formattedParent,
  //     transferConfig: {
  //       destinationDatasetId: 'Business',
  //       displayName: 'test by API',
  //       params: {
  //         fields:
  //         {
  //           query: { stringValue: 'SELECT A,B, C FROM Business.Customers' },
  //           destination_table_name_template: { stringValue: 'Customers2' },
  //           write_disposition: { stringValue: 'WRITE_TRUNCATE' }
  //         }
  //       },
  //       schedule: 'every 15 minutes',
  //       dataSourceId: "scheduled_query",
  //       disabled: false,
  //       datasetRegion: 'europe'
  //     }
  //   });

}

quickstart();
