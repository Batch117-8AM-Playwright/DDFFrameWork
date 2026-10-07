import{test , expect} from '@playwright/test'
import myExcel from 'xlsx'
import myJson from 'fs'


test.describe("Test Scenario on Adding Multiple Employees", ()=>
{

    function readExcel(fpath : string, sname : string)
    {
        const wb = myExcel.readFile(fpath);
        const ws : any = wb.Sheets[sname];
        return myExcel.utils.sheet_to_json(ws, {header : 1})
    }
    let page : any;
    let contxt;

    test.beforeAll("Launch my pplication", async({browser})=>
    {
        contxt = await browser.newContext({
        recordVideo : {
            dir : './MyEmpsVideo/',
            size : {width : 1280, height : 720}
        }
        });
        page = await contxt.newPage();
        await page.goto("http://127.0.0.1/orangehrm-2.5.0.2/login.php")
    })

    test("Test Case to Multiple  Employees", async()=>
    {
        test.setTimeout(1000000);

        const jsondata = JSON.parse(myJson.readFileSync('./XpathJson/AllXpaths.json', 'utf-8'))
        const elogin : any = readExcel('./Empinfo/OrangeData.xlsx', 'LoginData')
        const edata : any = readExcel('./Empinfo/OrangeData.xlsx', 'EmpDetails')
        await page.locator(jsondata.XUN).fill(elogin[1][0])
        await page.waitForTimeout(500);
        await page.locator(jsondata.XPWD).fill(elogin[1][1])
        await page.waitForTimeout(500);
        await page.locator(jsondata.XSUB).click();

        await page.waitForTimeout(500);

        await page.screenshot({path : "./MyTestProofs/AfterLogin.jpg"})
        for(let r = 1 ; r < edata.length;  r++)
        {
        await page.waitForTimeout(1000);

        await page.locator(jsondata.XPIM).hover();

        await page.waitForTimeout(500);

        await page.locator(jsondata.XADD).click();
        await page.waitForTimeout(1000);

        await page.frameLocator(jsondata.XFRAME).locator(jsondata.XID).fill(edata[r][0].toString());  ///number converts to string
        await page.waitForTimeout(500);
        await page.frameLocator(jsondata.XFRAME).locator(jsondata.XFIRST).fill(edata[r][1]);
        await page.waitForTimeout(500);
        await page.frameLocator(jsondata.XFRAME).locator(jsondata.XLAST).fill(edata[r][2]);
        await page.waitForTimeout(500);
        await page.frameLocator(jsondata.XFRAME).locator(jsondata.XMID).fill(edata[r][3]);
        await page.waitForTimeout(500);
        await page.frameLocator(jsondata.XFRAME).locator(jsondata.XNICK).fill(edata[r][4]);

        await page.waitForTimeout(500);
        await page.frameLocator(jsondata.XFRAME).locator(jsondata.XPHOTO).setInputFiles("./EmpPhotos/" +edata[r][1] +".jpg")

        await page.waitForTimeout(500);
        await page.screenshot({path : "./MyTestProofs/" +edata[r][1] +"_BeforeSave.jpg"})
        await page.frameLocator(jsondata.XFRAME).locator(jsondata.XSAVE).click();

        await page.waitForTimeout(3000);
        await page.screenshot({path : "./MyTestProofs/" +edata[r][1] +"_AfterSave.jpg"})
        await page.frameLocator(jsondata.XFRAME).locator(jsondata.XBACK).click();

        await page.waitForTimeout(2000);
        await page.screenshot({path : "./MyTestProofs/" +edata[r][1] +"_AfterAdd.jpg"})
        console.log("The Employee with Name : " +edata[r][1] +" , added successfully");

    }//end of for loop


        await page.waitForTimeout(5000);
    })


})
