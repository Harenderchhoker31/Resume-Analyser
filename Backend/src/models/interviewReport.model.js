const mongoose=require('mongoose')
const { string, number } = require('zod')


const technicalQuestionSchema=new mongoose.Schema({
    question:{
        type:String,
        required:[true,"Question is required"]
    },
    answer:{
        type:String,
        required:[true,"Answer is required"]   
    },
    intention:{
        type:String,
        required:[true,"Intention is required"]
    }
 },{_id:false}) //bcoz not storing question anywhere else

const behavioralQuestionSchema=new mongoose.Schema({
    question:{
        type:String,
        required:[true,"Question is required"]
    },
    answer:{
        type:String,
        required:[true,"Answer is required"]   
    },
    intention:{
        type:String,
        required:[true,"Intention is required"]
    }
},{_id:false})

const skillGapSchema=new mongoose.Schema({
    skill:{
        type:string,
        required:[true,"Skill is required"]
    },
    severity:{
        type:String,
        enum:["Low","Medium","High"],
        required:[true,"Severity is required"]
    }
},{_id:false})

const preprationPlanSchema=new mongoose.Schema({
    day:{
        type:number,
        required:[true,"Day is required"]
    },
    focus:{
        type:String,
        required:[true,"Focus is required"]

    },
    tasks:[{
        type:String,
        required:[true,"Task is required"]
    }]
   
})

const interviewReportSchema=new mongoose.Schema({
    jobDescription:{
        type:string,
        required:[true,"Job description is required"]
    },
    resume:{
        type:String,
    },
    selfDescription:{
        type:string
    },
    matchScore:{
        type:number,
        min:0,
        max:100

    },
    technicalQuestion:[technicalQuestionSchema],
    behavioralQuestion:[behavioralQuestionSchema],
    skillGap:[skillGapSchema],
    preprationPlan:[preprationPlanSchema]

},{
    timestamps:true
})

const interviewReportModel=mongoose.model('Interview Report',interviewReportSchema)

module.exports=interviewReportModel;