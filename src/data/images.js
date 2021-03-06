/**
 * @ContributorsList
 * @Inateno / http://inateno.com / http://dreamirl.com
 *
 * this is the images file sample that will be loaded by the project in the ResourcesManager module
 * it can also load .json files (for sheets and particles)
 * Please declare in the same way than this example.
 * To load image as default just set "load" to true.
 *
 * Otherwise you can load/add images when you want, load images by calling the DREAM_ENGINE.ImageManager.pushImage function
 *
 * - [ name, url, { load:Bool, totalFrame:Int, totalLine:Int, interval:Int (ms), animated:Bool, isReversed:Bool } ]
 *
 * name, and url are required
 */
import customLoad from "../../assets/imgs/customLoad/importAssets.json"
const images = {
  // images folder name 
  baseUrl: "imgs/",

  // usage name, real name (can contain subpath), extension, parameters
  pools: {
    // loaded when engine is inited
    default: function () {
      const perso = customLoad.map(l => {
        const out = []
        out.push(l.file)
        if (l.path.includes("\\")) {
          out.push("customLoad\\" + l.path.split(".\\")[1])
        } else {
          out.push("customLoad/" + l.path.split("./")[1])
        }
        return out
      })
      console.log(perso)
      return perso.concat(
        [["card", "shmup/card.png"],
        ["backCardPicker", "shmup/back.png"],
        ["cardHighlight", "shmup/cardHighlight.png"],
        ["particle", "shmup/p-bullet.png", { "totalFrame": 10, "interval": 50, "animated": true, "loop": false }],
        ["target", "shmup/target.png"],
        ["reactor", "shmup/reactor.png", { "totalFrame": 4, "interval": 40, "animated": true }],
          "shmup/ship.json",

        ["bg", "env/bg.jpg", { "totalFrame": 1, "animated": false, "isReversed": false }],
        ["canyon", "env/canyon.png", { "totalFrame": 1, "animated": false, "isReversed": false }],
        ["grass", "env/grass.png", { "totalFrame": 1, "animated": false, "isReversed": false }],
        ["touchControlBackground", "touch-control/background.png", { "totalFrame": 1, "animated": false }],
        ["touchControlStick", "touch-control/stick.png", { "totalFrame": 1, "animated": false }],

        ["platform", "platform.png", { "totalFrame": 1, "interval": 1, "totalLine": 1, "animated": false }]]
      )
    }(),

    // a custom pool not loaded by default, you have to load it whenever you want (you can display a custom loader or just the default loader)
    aCustomPool: [
      // resources
    ]
  }
};

export default images;
