const mongoose=require('mongoose')
  

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
        type:String,
        required:[true,"Skill is required"]
    },
    severity:{
        type:String,
        enum:["low","medium","high"],
        required:[true,"Severity is required"]
    }
},{_id:false})

const preprationPlanSchema=new mongoose.Schema({
    day:{
        type:Number,
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
        type:String,
        required:[true,"Job description is required"]
    },
    resume:{
        type:String,
    },
    selfDescription:{
        type:String
    },
    matchScore:{
        type:Number,
        min:0,
        max:100

    },
    technicalQuestion:[technicalQuestionSchema],
    behavioralQuestion:[behavioralQuestionSchema],
    skillGap:[skillGapSchema],
    preprationPlan:[preprationPlanSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",

    },
    title:{
        type:String,
        required:[true,"Title is required"] 
    }

},{
    timestamps:true
})

const interviewReportModel=mongoose.model('Interview Report',interviewReportSchema)

module.exports=interviewReportModel;