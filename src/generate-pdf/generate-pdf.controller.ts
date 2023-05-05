import { Controller, Get, Header, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import * as puppeteer from 'puppeteer';
import { GeneratePdfParam } from './models/GeneratePdfParam';

@Controller('generate-pdf')
export class GeneratePdfController {
    @Get()
    @Header('Content-Type', 'application/pdf')
    async generate(params: GeneratePdfParam, @Res() res: Response) {
        console.log('params: ', params);
        // 
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        // 创建新页面
        const page = await browser.newPage();
        await page.goto("http://npm.51baiwang.com/#/", {waitUntil: 'networkidle0'})
        // await page.emulateMediaType('screen')
        // 页眉模板（图片使用base64，此处的src的base64为占位值）
        const headerTemplate = `<div
        style="width: calc(100% - 28px); margin-top: -13px; font-size:8px;border-bottom:2px solid #e1dafb;padding:6px 14px;display: flex; justify-content: space-between; align-items:center;">
        <span style="color: #9a7ff7; font-size: 12px; font-family: my-font;">张博的模板</span>
        <img style="width: 80px; height: auto;" src="data:image/png;base64,iVBORw0KGgoAAAxxxxxx" />
        </div>`
        // 页脚模板（pageNumber处会自动注入当前页码）
        const footerTemplate = `<div 
        style="width:calc(100% - 28px);margin-bottom: -20px; font-size:8px; padding:15px 14px;display: flex; justify-content: space-between; ">
        <span style="color: #9a7ff7; font-size: 10px;">蒲公英绩效</span>
        <span style="color: #9a7ff7; font-size: 13px;" class="pageNumber"></span> 
        </div>`;
        const options: puppeteer.PDFOptions = {
            headerTemplate,
            footerTemplate,
            margin: {
                top: 48,
                bottom: 48,
                left: 24,
                right: 24
            },
            displayHeaderFooter: true,
            printBackground: true,
            format: 'A4',
            scale: 1
        }
        // 拿到PDF文件流
        const pdf = await page.pdf(options);
        // 关闭无头浏览器 防止内存泄漏
        await browser.close();
        res.send(pdf)
    }

}
