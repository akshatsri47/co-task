import { GoogleGenerativeAI } from '@google/generative-ai';
import { requestToBodyStream } from 'next/dist/server/body-streams';
import { NextRequest, NextResponse } from 'next/server';


export  async function POST(req:NextRequest,res:NextResponse) {
    const body = await req.json();
    const task = body.task;  


const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genai.getGenerativeModel({ model: "gemini-2.0-flash" });
console.log(genai);

const prompt = `# Task Generation Prompt Template

## Objective
Generate a structured 4-week task list with concise, clear tasks.

## Output Specifications
- Use short, clear task names (2-5 words max).
- Create a 4-week task plan.
- Each week should include:
  - 2-3 main tasks.
  - Each main task should have 3-4 actionable subtasks.

## Output Format

### Week 1: [Brief Focus Area]
**Initial Setup**
- Install development environment  
- Configure tools  
- Review basic concepts  

**Fundamental Concepts**
- Watch introductory videos  
- Complete basic tutorials  
- Take initial notes  

### Week 2: [Skill Development]
**Basic Techniques**
- Practice core skills  
- Complete beginner exercises  
- Review progress  

**First Project Prep**
- Plan small project  
- Gather resources  
- Start initial draft  

### Week 3: [Advanced Learning]
**Complex Skills**
- Follow advanced tutorials  
- Practice challenging exercises  
- Analyze complex examples  

**Project Development**
- Build main project  
- Implement core features  
- Test initial version  

### Week 4: [Final Stage]
**Project Refinement**
- Complete project  
- Optimize code  
- Add advanced features  

**Final Review**
- Comprehensive practice  
- Create summary document  
- Plan next steps  

## Customization Guidelines
- Keep main tasks concise (2-5 words).
- Use clear, action-oriented language.
- Ensure subtasks are specific and achievable.


### Key Features:
- Extremely concise main task names.  
- Clear, actionable subtasks.  
- Easy to read and display.  
- Flexible for various objectives.
## Generate tasks for: ${task} `

const result = await model.generateContent(prompt);
console.log(result.response.text());
return NextResponse.json({data : result.response.text()});


}
export  async function GET(req:NextRequest,res:NextResponse) {
 return NextResponse.json({ data: "Hello, World!" });

}
