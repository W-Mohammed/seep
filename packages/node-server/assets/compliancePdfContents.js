const yamlHeader = `---
body_class: markdown-body
highlight_style: monokai
pdf_options:
  margin: 30mm 30mm
  printBackground: true
  headerTemplate: |-
    <style>
      section {
        margin: 0 auto;
        font-family: system-ui;
        font-size: 11px;
      }
    </style>
    <section> &nbsp; </section>
  footerTemplate: |-
    <section><span class="pageNumber"></span>/<span class="totalPages"></span>
    </section>
---
`

const makePageBreak = () => `<div style="page-break-after: always;"></div>`

const makeTitlePage = (obj) => 
  /* html */
  `<div>
</div><div class="monospace text-gray top">Structured Expert Elicitation &ndash; Survey Documentation </div>
<div class="mt-10 title-page">
    <div class="title">${obj.surveyTitle}</div>
    <div>
        SurveyID: <span class="bold">${obj.surveyID}</span>
    </div>
    <div>
        Last Updated: <span class="bold">${obj.lastUpdated}</span>
    </div>
    <div class="mt-2">
        Prepared by:  <span class="bold">${obj.tenantName}</span>
    </div>
    <div>
        Survey Administrator:  <span class="bold">${obj.userName}</span>
    </div>
    <div class="text-gray mt-1">
        ${obj.date}
    </div>

<div class="text-gray text-sm bottom">
    Confidentiality Notice: This document contains confidential information intended only for the use of the specified recipient(s). Unauthorised review, use, disclosure, or distribution is prohibited.
    </div>
</div>
`

const makeIntro = (obj ) => `<h2>Introduction</h2>

This report provides an overview of the structured expert elicitation survey (Survey ID: ${obj.surveyID}) prepared by ${obj.tenantName} and administered by ${obj.userName}. The survey was last updated on ${obj.lastUpdated}.

The report is divided into two parts: 

A) The first part contains general information about the methodology and different types of questions

B) The second part provides detailed information about the specific questions contained within the survey
`

const makeGeneralInfo  = () =>  `<h1 class="mt-4">A) General Information</h1>

<div class="mt-2 bold">Expert Participation</div>
Expert access the survey through a unique URL. Their progress is saved continuously, enabling experts to pause and resume the survey at their convenience until the survey's conclusion.

<div class="mt-2 bold">Survey Structure</div>
The survey consisted of [number] questions. Experts navigate through the survey sequentially or use a navigation menu to jump to specific sections.

<div class="mt-2 bold">Data submission</div>
Any required, but incomplete question will be highlighted to the expert. However, they will be allowed to proceed to subsequent questions and to submit their responses on the last page. Upon submission, experts are unable to make further changes. 

<div class="mt-2 bold">Data Privacy</div>
Experts must consent to participate before starting the survey. All personal information will be handled in accordance with GDPR. Participants have the right to access, rectify, and erase their data upon request.
`

const makeRouletteInfo  = ( ) =>  `<h2 class="">Roulette / Chips-and-bins Questions</h2><p>Roulette or Chips-and-Bins is a method used for eliciting probability distributions from experts regarding specific outcomes or variables. It is implemented as a two-step procedure outlined below. Screenshots are provided to illustrate the interface.
</p><p>Step 1: Experts are asked to provide a range in which the outcome plausibly falls. If there are natural limits to the outcome of interest (e.g. 0-100 for Percentages), those are displayed and enforced.
</p><div class="img-container"><img class="img-roulette" src="../assets/roulette-step-1.png" alt="Roulette Step 1" ></div>
<div class="caption">Roulette Step 1: Plausible range for the outcome</div><p>Step 2: Experts are then given 20 “chips" to distribute across a set of “bins” within the estimated range. Each bin represents a possible value for the outcome in question. The distribution of chips reflects the expert's belief about the likelihood of each value. The more chips placed in a bin, the higher the probability the expert assigns to that value occurring.</p><div class="img-container"><img class="img-roulette" src="../assets/roulette-step-2-A.png" alt="Roulette Step 2" ></div>
<div class="caption">Roulette Step 2: Distribution of chips across bins</div>${makePageBreak()}<p>A summary below the bins-grid gives feedback to the expert and about how their distribution of chips translates into a probability distribution for the outcome in question &ndash; see 'Summary' panel in the screenshot below.</p><div class="img-container"><img class="img-roulette" src="../assets/roulette-step-2-B.png" alt="Roulette Step 2" ></div><div class="caption">Roulette Step 2: Summary of probability distribution</div><p>Experts can adjust and change the plausible range they provided in step 1 by clicking on 'Change range'.</p><p>After all chips have been allocated, experts are usually asked to provide some rationale for their chip distribution, which helps in understanding the reasoning behind their probability assessments. This feature can be turned off.</p>
<div class="img-container"><img class="img-roulette" src="../assets/roulette-rationale.png" alt="Roulette Rationale" > </div>
<div class="caption">Roulette: Rationale for chip distribution</div>
`


const makeMinMaxBestInfo = () => `<h2 class="">Min/Max/Best Questions</h2><p>Min-Max-Best Estimate questions elicit plausible ranges and best estimates from experts. The range (lowest and highst plausible values) are elicited first. If there are natural limits to the outcome of interest (e.g. 0-100 for Percentages), those are displayed and enforced.</p><div class="img-container"><img class="img-roulette" src="../assets/minmaxbest-step-1.png" alt="Min/Max/Best" ></div><div class="caption">Plausible range for the outcome</div><p>Experts are then asked to provide a best estimate for the outcome in question. The best estimate must fall within the plausible range provided in the previous step.</p><div class="img-container"><img class="img-roulette" src="../assets/minmaxbest-step-2.png" alt="Min/Max/Best" ></div><div class="caption">Best estimate for the outcome</div><p>Experts can be asked to provide a rationale for their estimates, which can be used to understand the reasoning behind their assessments. This feature is be turned off.</p><div class="img-container"><img class="img-roulette" src="../assets/minmaxbest-rationale.png" alt="Min/Max/Best" ></div><div class="caption">Rationale for estimates</div>`

const cssStyle = `
<style>
.page-break {
  page-break-after: always;
}
.markdown-body {
  font-family: 'Helvetica Neue', 'Helvetica', sans-serif;
  font-size: 12px;
  line-height: 1.4;
}
.markdown-body pre > code {
  white-space: pre-wrap;
}

.title {
  font-size: 18px;
  font-weight: bold;
  max-width: 90%;
  margin-bottom: 12px;
}

.mt-1 {
    margin-top: 10px;
}

.mt-2 {
    margin-top: 20px;
}

.monospace {
  font-family: monospace;
}

.bottom {
    position: absolute;
    bottom: 0;
}

.top {
    position: absolute;
    top: 0;
}

.bold {
    font-weight: bold;
    }

h1 {
  font-size: 18px;
  font-weight: bold;
  margin-top: 0px;
  margin-bottom: 8px;
}

h2 {
  font-size: 14px;
  font-weight: bold;
  margin-top: 0px;
  margin-bottom: 10px;
}

.mt-4 {
  margin-top: 40px;
}

.mt-10 {
    margin-top: 100px;
}

a {
    color: #ff5f56;
    text-decoration: none;
}

div {
    display: block;
    page-break-inside : avoid;
}

.agendaItem-title {
    font-size: 14px;
    font-weight: bold;
}

.agendaItem-container {
    margin-top: 4px;
    margin-bottom: 40px;
}

.agendaItem {
    padding-left: 16px;
}

.img-roulette {
  max-width: 340px;
  margin: 0 auto;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}

.img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.caption {
  font-size: 10px;
  color: #6c6c6c;
  text-align: center;
}

.text-gray {
  color: #6c6c6c;
}

.text-sm {
  font-size: 12px;
}

.bold {
  font-weight: bold;
}

.subtitle {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  color: #333;
}

.header {
  font-size: 12px;
  text-align: right;
  margin-top: 20px;
}

.footer {
  font-size: 12px;
  text-align: right;
  margin-top: 20px;
}

.date,
.tenant {
  font-size: 12px;
  text-align: left;
}
.platform {
  font-size: 12px;
  text-align: left;
  color: red;
}
.powered-by-1 {
  font-size: 12px;
  text-align: left;
  color: #333;
  font-weight: light;
}
.powered-by-2 {
  font-size: 12px;
  text-align: left;
  color: #333;
}
</style>
`






module.exports = { yamlHeader, makePageBreak, makeTitlePage, makeIntro, makeGeneralInfo, makeRouletteInfo,makeMinMaxBestInfo, cssStyle }