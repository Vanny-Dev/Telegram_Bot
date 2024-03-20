require("./app/server.js");
require("dotenv").config();

/***********************TELEGRAM API**********************/
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN;
const bot = new TelegramBot(token, {polling: true});

/***********************MUSIC API**********************/
const {download, search, getStreamFormats, getVideoInfo} = require("youtube-s-dl");
const ytdl = require('ytdl-core');

/***********************OTHER NPM PACKAGES**********************/
const sharp = require("sharp");
const fs = require("fs");

/***********************PREFIX**********************/
const prefix = "/";

/***********************MUSIC**********************/
bot.on('message', (message) => {
    
    let chatID = message.chat.id;
    let input = message.text;

    if (input.startsWith(prefix+"play")) {

        let data = input.split(" ");
        if (data.length < 2) {
            bot.sendMessage(chatID, "⚠️Invalid Use Of Command!\💡Usage: " + prefix + "play <name of music>");
          }
          else {
            data.shift()
            data = data.join(" ")
            //console.log(data)
            bot.sendMessage(chatID,"Please Wait ⏳...");

            try {
                (async () => {
                    let result = await search(`${data} lyrics`)
                    //console.log(result[0])

                    //getVideoInfo param. is string
                    //let info = getStreamFormats(result[0].videoId)
                    //console.log(info)

                    let title = result[0].title;
                    let videoLength = result[0].videoLength.simpleText;
                    let viewCount = result[0].shortViewCount.simpleText;
                

                    const url = `https://www.youtube.com/watch?v=${result[0].videoId}`
                    const path = `assets/${data}.mp3`;
                    const file = fs.createWriteStream(path);
                    const videoStream = ytdl(url, { quality: 'highestaudio', filter: 'audioonly' });
                    videoStream.pipe(file)
                    .on('finish',()=>{
                        console.log("Video Downloaded")
                    }).on('close',()=>{
                        console.log("Request Finished")
                    }).on('error',()=>{
                        console.log("Seems there's an error happened while writing the file.")
                    })
                    setTimeout(() => {
                    if (fs.existsSync(path)) {
                    
                            // var message = {
                            // chat_id: chatID,
                            // audio: path,
                            // caption: `${data}.mp3`
                            // }
    
                            bot.sendAudio(chatID, path, {caption: `Title: ${title}🎵\nVideo_Length: ${videoLength}\nViews: ${viewCount}`})
                                .then(() => {
                                    fs.unlinkSync(path); // Delete the file after sending
                                })
                        
                    }
                    else {
                        console.log("Audio file does not exist at the specified path:", path);
                        bot.sendMessage(chatID, "Failed to find the audio file.");
                      }    
                    }, 4000);

                })()
            }
            catch (err) {
              bot.sendMessage(chatID, `⚠️${err.message}`);
            };
        }
    }

    
});

bot.on('message', (message) => {
    
    let chatID = message.chat.id;
    let input = message.text;

    if (input.startsWith(prefix+"video")) {

        let data = input.split(" ");
        if (data.length < 2) {
            bot.sendMessage(chatID, "⚠️Invalid Use Of Command!\💡Usage: " + prefix + "playVid <name of video>");
          }
          else {
            data.shift()
            data = data.join(" ")
            //console.log(data)
            bot.sendMessage(chatID,"Please Wait ⏳...");

            try {
                (async () => {
                    let result = await search(`${data}`)
                    //console.log(result[0])

                    //getVideoInfo param. is string
                    //let info = getStreamFormats(result[0].videoId)
                    //console.log(info)

                    let title = result[0].title;
                    let videoLength = result[0].videoLength.simpleText;
                    let viewCount = result[0].shortViewCount.simpleText;
                

                    const url = `https://www.youtube.com/watch?v=${result[0].videoId}`
                    const path = `assets/${data}.mp4`;
                    const file = fs.createWriteStream(path);
                    const videoStream = ytdl(url, { quality: 'highest', filter: 'videoandaudio' });
                    videoStream.pipe(file)
                    .on('finish',()=>{
                        console.log("Video Downloaded")
                    }).on('close',()=>{
                        console.log("Request Finished")
                    }).on('error',()=>{
                        console.log("Seems there's an error happened while writing the file.")
                    })
                    setTimeout(() => {
                    if (fs.existsSync(path)) {
                    
                            // var message = {
                            // chat_id: chatID,
                            // audio: path,
                            // caption: `${data}.mp3`
                            // }
    
                            bot.sendVideo(chatID, path, {caption: `Title: ${title}🎵\nVideo_Length: ${videoLength}\nViews: ${viewCount}`})
                                .then(() => {
                                    fs.unlinkSync(path); // Delete the file after sending
                                })
                        
                    }
                    else {
                        console.log("Audio file does not exist at the specified path:", path);
                        bot.sendMessage(chatID, "Failed to find the audio file.");
                      }    
                    }, 7000);

                })()
            }
            catch (err) {
              bot.sendMessage(chatID, `⚠️${err.message}`);
            };
        }
    }

    
});


/***********************FACT**********************/
async function addTextOnImage(t) {
    try {
      let img = await sharp("./assets/facts.png").metadata();
      const width = img.width;
      const height = img.height;
      const text = t;
  
      const svgImage = `
          <svg width="${width}" height="${height}">
          <style>
          .title { fill: #000; font-size: 20px; font-family: Tahoma;}
          </style>
          <text x="30%" y="60%" text-anchor="middle" class="title" transform="translate(100,100) rotate(15)" text-align="justify" text-justify="inter-word">${text}</text>
          </svg>
          `;
      const svgBuffer = Buffer.from(svgImage);
      const image = await sharp(svgBuffer).toFile(`${t}_txt.png`);
      await sharp("./assets/facts.png")
        .composite([{
          input: `${t}_txt.png`,
          top: 50,
          left: 50,
        },])
        .toFile(`${t}_output.png`);
      return true
  
    } catch (error) {
      console.log(error.message);
      return false
    }
  }

bot.on('message', (message) => {
    
    let chatID = message.chat.id;
    let input = message.text;

    if (input.startsWith(prefix+"fact")) {

        let data = input.split(" ");
        if (data.length < 2) {
            bot.sendMessage(chatID, "⚠️Invalid Use Of Command!\💡Usage: " + prefix + "fact <text>");
        }
        else {
            try {
                (async () => {
                    data.shift()
                    let txt = data.join(" ").replace("\\", "");
                    let img = await addTextOnImage(txt);
                    if (!img) {
                        throw new Error("Failed to Generate Image!")
                    } 
                    else {
                        bot.sendPhoto(
                            chatID, fs.createReadStream(`${__dirname}/${txt}_output.png`)
                            .on("end", async () => {
                                if (fs.existsSync(`${__dirname}/${txt}_output.png`)) {
                                    fs.unlink(`${__dirname}/${txt}_output.png`, function(err) {
                                        if (err) console.log(err);
                                        console.log(`${__dirname}/${txt}_output.png is deleted!`);
                                    });
                                }
                                if (fs.existsSync(`${__dirname}/${txt}_txt.png`)) {
                                    fs.unlink(`${__dirname}/${txt}_txt.png`, function(err) {
                                        if (err) console.log(err);
                                        console.log(`${__dirname}/${txt}_txt.png is deleted!`);
                                    });
                                }
                            })
                        );
                    }
                })()
            }
            catch (err) {
              bot.sendMessage(chatID, `⚠️${err.message}`);
            };
        }
    }

})