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
        ["card1", "card/carte_1.svg"],
        ["card2", "card/carte_2.svg"],
        ["card3", "card/carte_3.svg"],
        ["card4", "card/carte_4.svg"],
        ["card5", "card/carte_5.svg"],
        ["card6", "card/carte_6.svg"],
        ["card7", "card/carte_7.svg"],
        ["card1_plus", "card/carte_1_plus.svg"],
        ["card2_plus", "card/carte_2_plus.svg"],
        ["card3_plus", "card/carte_3_plus.svg"],
        ["card4_plus", "card/carte_4_plus.svg"],
        ["card5_plus", "card/carte_5_plus.svg"],
        ["card6_plus", "card/carte_6_plus.svg"],
        ["card7_plus", "card/carte_7_plus.svg"],
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
