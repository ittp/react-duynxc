const speedTest = require('speedtest-net');

(async () => {
  try {
    const cancel = speedTest.makeCancel();
    setTimeout(cancel, 10000);
    console.log(await speedTest({ cancel }));
  } catch (err) {
    console.log(err.message);
  } finally {
    process.exit(0);
  }
})();