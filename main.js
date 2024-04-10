import fs from "node:fs"
import path from 'node:path'
import {Buffer, Blob} from 'node:buffer'
import axios from "axios"
import zlib from "zlib"


(async () => {
	let files = fs.readdirSync(process.cwd())
	for (var i = 0; i < files.length; i++) {
		let so = null
		try{
			so = fs.readdirSync(files[i])
		}catch(e){ 
			console.log('not is a directory...')
			continue 
		}
		so = so.filter(el => el.includes('.jpg') || el.includes('.png'))
		for (var j = 0; j < so.length; j++) {
			let bitmap = fs.readFileSync(path.join(process.cwd(), files[i], so[j]), 'base64')
			
			await axios.post('http://localhost:5000/api/removebg', {image_file_b64: bitmap}, 
						{headers: {'Content-Type': 'multipart/form-data', 'X-Api-Key': 'test_token1'}, responseType: 'arraybuffer'}).then((res)=>{
				let name = path.join(process.cwd(), files[i], ((so[j].split('.'))[0]+'-sbg.png'))
				
				fs.writeFileSync(name, res.data)
				console.log('write '+name+' file')
			}).catch(e => {
				console.log(e)
				
			})
			
		}
	}
})();
