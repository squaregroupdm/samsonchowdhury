/* ============================================================
   PHOTO ALBUMS
   PHOTO_BASE points at where the photo-gallery folder lives.
   When the new site is hosted on samsonchowdhury.com, change it to "".
   Each album: id, title, files (numbers as they appear on the server),
   captions keyed by file number (optional).
   ============================================================ */

window.PHOTO_BASE = "https://samsonchowdhury.com/en/";

window.ALBUMS = [
  {
    id: "early-life",
    title: "Early Life",
    files: ["01", "02", "03", "04", "05", "06"],
    captions: { "01": "Samson in his infancy", "02": "Samson in his infancy", "03": "Samson (left) with his younger brother", "04": "Samson as a teenager", "05": "Young Samson", "06": "Young Samson" }
  },
  {
    id: "with-familly-members",
    title: "With Family",
    files: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "17", "11", "12", "13", "14", "15"],
    captions: { "01": "Father, Dr EH Chowdhury", "02": "With father, Dr EH Chowdhury", "03": "Wife, Mrs Anita Chowdhury", "04": "With father, wife and eldest son", "05": "With wife, Mrs Anita Chowdhury", "06": "Golden wedding anniversary, 6 August 1997", "07": "With wife, sons and daughter", "08": "With wife, sons and daughter", "09": "With wife and grandchildren", "10": "With wife and grandchildren", "17": "With wife and grandchildren", "11": "With father, wife and others", "12": "Birthday celebration" }
  },
  {
    id: "while-at-work-or-at-leisure",
    title: "At Work and at Leisure",
    files: ["01", "02", "03", "05", "10", "11", "12", "13", "14", "15", "17", "19", "20", "21", "22", "23", "24", "26", "27", "28", "29", "30", "31", "33", "40", "39", "38", "34", "35", "37", "09", "32"],
    captions: {}
  },
  {
    id: "with-dignitaries",
    title: "With Dignitaries",
    files: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"],
    captions: { "01": "Exchanging greetings with late President Mohammad Zillur Rahman", "02": "With Prime Minister Sheikh Hasina and Mr Dev Gouda, former Prime Minister of India", "03": "At a Rotary Club programme with the then Prime Minister Begum Khaleda Zia", "04": "Shaking hands with the then President Hussain Muhammad Ershad", "05": "Exchanging greetings with Awami League leader Tofail Ahmed", "06": "With former Caretaker Government Chief Adviser Mr Fakhruddin Ahmed", "07": "With Pope John Paul II", "08": "With Bill Gates, Chairman of Microsoft", "09": "With Nobel Laureate Amartya Sen", "10": "With Inder Kumar Gujral, former Prime Minister of India" }
  },
  {
    id: "foreign-tours",
    title: "Foreign Tours",
    files: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"],
    captions: { "01": "Hunting camp, 2006", "02": "With UAE Minister H.E. Sheikh Mubarak Bin Muhammad Al Nahyan", "03": "Hunting camp, 2006", "05": "On the Great Wall, China", "09": "At the BWA Congress in Los Angeles", "10": "In Delhi with a trade delegation" }
  },
  {
    id: "philanthropic-endeavors",
    title: "Philanthropy",
    files: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"],
    captions: { "03": "Laying the foundation stone of the NCC building, 1978", "04": "BBF Conference, 1980", "05": "Reception given by International Needs, 1991", "06": "Fourth Christian Musical Conference, 1991", "07": "Farewell ceremony of Rev and Mrs Jim McKinley", "08": "Laying the foundation stone of the BBF Conference Centre at Rajendrapur", "09": "Opening ceremony of the BBF Conference Centre, 1991", "10": "Signing the UBCTA" }
  },
  {
    id: "in-memoriam",
    title: "In Memoriam",
    files: ["01", "02", "03", "04", "05", "06", "07", "08"],
    captions: {}
  },
  {
    id: "inauguration-website",
    title: "Website Launch",
    files: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
    captions: {}
  }
];

window.VIDEO_BASE = "https://samsonchowdhury.com/en/videos/";

window.VIDEOS = [
  { file: "a-glimpse-of-life.mp4", title: "A Glimpse of Life", blurb: "An overview of a life that began in Gopalganj in 1925 and shaped an industry." },
  { file: "establishment-of-square.mp4", title: "Establishment of Square", blurb: "Four friends, Rs 17,000 and a tin-shed factory in Pabna." },
  { file: "liberation-war-memories.mp4", title: "Liberation War Memories", blurb: "Recollections from 1971." },
  { file: "message-for-new-generation.mp4", title: "Message for the New Generation", blurb: "Words to young entrepreneurs." },
  { file: "philosophy-of-life.mp4", title: "Philosophy of Life", blurb: "Faith, work and people." },
  { file: "samson-a-caring-husband.mp4", title: "Samson, a Caring Husband", blurb: "Sixty-four years with Anita Chowdhury." },
  { file: "funeral-prayer.mp4", title: "Funeral Prayer", blurb: "Kakrail Catholic Church, Dhaka. 6 January 2012." },
  { file: "laid-to-etermal-rest.mp4", title: "Laid to Eternal Rest", blurb: "Astra Farmhouse, Pabna. 7 January 2012." },
  { file: "inauguration-of-website.mp4", title: "Inauguration of the Official Website", blurb: "The launch of samsonchowdhury.com." }
];
