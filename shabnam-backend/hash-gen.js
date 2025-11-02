const bcrypt = require('bcryptjs')

async function run() {
  const hash = await bcrypt.hash('ShamiCompanyPassword#1', 10)
  // console.log('Generated hash:', hash)
}

run()
