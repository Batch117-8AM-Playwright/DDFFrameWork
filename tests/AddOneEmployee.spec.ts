import{test , expect} from '@playwright/test'
import myExcel from 'xlsx'
import myJson from 'fs'


test.describe("Test Scenario on Adding One Employee", ()=>
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
        contxt = await browser.newContext();
        page = await contxt.newPage();
        await page.goto("http://127.0.0.1/orangehrm-2.5.0.2/login.php")
    })

    test("Test Case to Add one Employee", async()=>
    {

        const jsondata = JSON.parse(myJson.readFileSync('./XpathJson/AllXpaths.json', 'utf-8'))
        const elogin : any = readExcel('./Empinfo/OrangeData.xlsx', 'LoginData')
        const edata : any = readExcel('./Empinfo/OrangeData.xlsx', 'EmpDetails')
        await page.locator(jsondata.XUN).fill(elogin[1][0])
        await page.waitForTimeout(500);
        await page.locator(jsondata.XPWD).fill(elogin[1][1])
        await page.waitForTimeout(500);
        await page.locator(jsondata.XSUB).click();

        await page.waitForTimeout(1000);

        await page.locator(jsondata.XPIM).hover();

        await page.waitForTimeout(500);

        await page.locator(jsondata.XADD).click();
        await page.waitForTimeout(1000);

        await page.frameLocator(jsondata.XFRAME).locator(jsondata.XID).fill(edata[1][0].toString());  ///number converts to string
        await page.waitForTimeout(500);
        await page.frameLocator(jsondata.XFRAME).locator(jsondata.XFIRST).fill(edata[1][1]);
        await page.waitForTimeout(500);
        await page.frameLocator(jsondata.XFRAME).locator(jsondata.XLAST).fill(edata[1][2]);
        await page.waitForTimeout(500);
        await page.frameLocator(jsondata.XFRAME).locator(jsondata.XMID).fill(edata[1][3]);
        await page.waitForTimeout(500);
        await page.frameLocator(jsondata.XFRAME).locator(jsondata.XNICK).fill(edata[1][4]);

        await page.waitForTimeout(500);
        await page.frameLocator(jsondata.XFRAME).locator(jsondata.XPHOTO).setInputFiles("./EmpPhotos/MyEmp1.png")

        await page.waitForTimeout(500);
        await page.frameLocator(jsondata.XFRAME).locator(jsondata.XSAVE).click();

        await page.waitForTimeout(3000);
        await page.frameLocator(jsondata.XFRAME).locator(jsondata.XBACK).click();



        await page.waitForTimeout(5000);
    })


})
