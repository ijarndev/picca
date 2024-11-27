import fs from 'node:fs'

export const log = (message) => {    
  console.log(message)

  fs.writeFile('./requests.log', `${message} \n`, { flag: 'a' }, (err) => {
    if(err) console.log(err)
  })
}

export const getResponse = (key) => {
  const obj = JSON.parse(fs.readFileSync('src/responses.json', 'utf-8'))
  const result = obj.find((e) => e.key === key).value
  
  return result
}