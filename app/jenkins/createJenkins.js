const getJob = require('./getJob');
const jenkinsApi = require('jenkins-api');
const Printf = require('./printf');
module.exports = async function (props,config, message) {
    const jobName = getJob(props.group,props.name,props.env);
    const printf = Printf(message);
    if(!jobName) return  printf('当前项目不支持git jenkins发布');
    const jenkins = jenkinsApi.init(config.jenkinsApi);
    if(props.createJob === true || props.createJob === 'true'){

    }else if(await isEixtJob()){{
            printf(`jenkins job: ${jobName}已存在`);
            printf(`create job  任务停止`);
            return
        }
    }
    printf(`正在执行jenkins create job: ${jobName}`);
   if(await createJob()){
       printf(`jenkins create job: ${jobName} 成功`)
   } else{
       printf(`jenkins create job: ${jobName} 失败`)
   }
    async function createJob() {
       const copyJob = getJob.copyJob();
        return new Promise((resolve,reject)=>{
            jenkins.copy_job(jobName,(config)=>{
                return config;
            },{},(err)=>{
                if(err){
                    resolve(false)
                }else{
                    resolve(true)
                }
            })
        })
    }
    async function isEixtJob() {
        return new Promise((resolve,reject)=>{
            jenkins.job_info(jobName,(err,data)=>{
                if(err){
                    resolve(false)
                }else{
                    resolve(true)
                }
            })
        })
    }

}







