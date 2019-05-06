
  const rp = require('request-promise');
  const cheerio = require('cheerio');
  const jsonfile = require('jsonfile')
  const file = 'data.json'

//URL -> enter lastName, First Name, email, netID or RUID to parse info. * is for general search
//Longformat gives more info, but kind of annoying to sort through

//Get all users (not recommended - it'll break)
// url: `https://sakai.rutgers.edu/addpart-lookup.jsp?last=&first=&anywhere=&email=&netid=&ruid=*&longformat=no`


  var options = {
    url: `https://sakai.rutgers.edu/addpart-lookup.jsp?last=&first=&anywhere=&email=&netid=&ruid=18*&longformat=no`,
    headers: {
      'Referer': `https://sakai.rutgers.edu/addpart-lookup.jsp?last=A*&first=&anywhere=&email=&netid=&ruid=`,
      'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Mobile Safari/537.36',
      'Cookie': 'visid_incap_1006801=badJ/WCvSRS2Xgd4uVWxj459f1kAAAAAQUIPAAAAAACebWbv94ptQmt3Y5MvuB74; visid_incap_581971=mN1cpp4vRrefwJaBZ1aSB4HIf1kAAAAAQUIPAAAAAAAw9JYrqZ0ZIa0JrMgqxcvX; _snow_id.e19c=43211750-1fb7-4abc-93d6-7b8dc21b75e3.1505266122.1.1505266207.1505266122.29da2505-64e8-4c7f-81df-b129563da075; __insp_uid=2621536440; visid_incap_1149778=Bc0bfOtGSXu8KdjP04xX5gEfmVkAAAAAQUIPAAAAAADO1AFoMNAXdBQBkveoKWC5; visid_incap_708992=ogv1j0ZgTuCcOj8wjZBsXp52f1kAAAAAQUIPAAAAAAB0daWfHJEFNcSQy6zcb23T; visid_incap_425582=afmDlNOPTvWxY0uVaO/diVJ9f1kAAAAAQUIPAAAAAABlYxtMxTvCgq8pZhIi0uEJ; _ga=GA1.2.1616835796.1501546628; _hp2_id.2689279202=%7B%22userId%22%3A%221726520084732753%22%2C%22pageviewId%22%3A%226348839994306261%22%2C%22sessionId%22%3A%228159174438818241%22%2C%22identity%22%3Anull%2C%22trackerVersion%22%3A%223.0%22%7D; visid_incap_707887=5VDk4yYPR0aJZdhYINURnd4sYVsAAAAAQUIPAAAAAADzZyucUwjS1XAIAynobELf; visid_incap_425585=cw8V3/ODTcCCDD+RpSn3OCJ8gVsAAAAAQUIPAAAAAAA/y9UqJwrYnfBLTKcLmJ38; _rollupga=GA1.2.264588535.1537602343; __qca=P0-1971105824-1544554672006; visid_incap_425592=t6iwVqFTQIaWfN19ZrzMTjQ1JVwAAAAAQUIPAAAAAACENecvTl66YEsb2f+kskdu; __unam=33af570-1689abc13f7-73f7b472-2; _fbp=fb.1.1551068264250.1476679976; _gcl_au=1.1.1786772403.1556041943; JSESSIONID=6404befb-4cad-4a21-ab14-edb9e4538575.sakai-web07-prod-asb; BIGipServerProd_Sakai_Pool=384572844.36895.0000; EssUserTrk=d40fb51.58828ac158e00; rxVisitor=1557083151062QK00S1QFNIR0HBGQVPBHNF0RP2PGU4KK; dtLatC=5; dtSa=true%7CKU%7C-1%7CdTMasked_BODY%7C-%7C1557083155149%7C83153186_433%7Chttps%3A%2F%2Fcas.rutgers.edu%2Flogin%5E%5Esjsessionid%3D2E7D90C8D5CE748EDF14B52CFC4F729F%3Fservice%3Dhttps_253A_252F_252Fsakai.rutgers.edu_252Fsakai-login-tool_252Fcontainer%7CRutgers%20Central%20Authentication%20Service%20%28CAS%29%7C1557083151045%7C; dtCookie=1$EEB76A687EDD25D16C752AF8D0694E5A|0716728ac9619b1e|1; rxvt=1557084956466|1557083151070; dtPC=1$83153186_433h-vMIPAGRFJCMMKFEJEBLPGDMPIKHHMBKFR'
    }
  }
  var users = [];
  rp(options)
    .then(function(html){
     $ = cheerio.load(html);
     $('tr').each(function(i){
       if($(this)[0].children[0].children != undefined){
      // contains the bulk of the information.
       var datum = ($(this)[0].children[1].children[0].data).split('—');
       //Bootleg but it works
      if(datum[0]==undefined){datum[0]="UNKNOWN"} if(datum[1]==undefined){datum[1]="UNKNOWN"} if(datum[2]==undefined){datum[2]="UNKNOWN"}
       var name = datum[0].split(',');
       if(name[0]==undefined){name[0]="UNKNOWN"}if(name[1]==undefined){name[1]="UNKNOWN"}
       var data = {
         "last": name[0].trim(),
         "first": name[1].trim(),
         "email": $(this)[0].children[0].children[0].attribs.value + "@rutgers.edu",
         "status": datum[1].trim(),
         "school": datum[2].split('0')[0].trim(),
         "graduation": datum[2].substring(datum[2].indexOf('0')).trim()
       }
       console.table(data);
       users.push(data);
     }
     //Writes to json file -> recommended convert json to xls for sorting and viewing
        jsonfile.writeFileSync(file, users);
     })
  })
  .catch(console.log());
