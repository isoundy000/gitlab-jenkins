const getJob = require('./getJob');
const jenkinsApi = require('jenkins-api');
const Printf = require('./printf');
const createJenkins = require('./createJenkins');
module.exports = async function (props,config, message) {
    //不关心多分支
    const jobName = getJob(props.group,props.name,props.env);
    const printf = Printf(message);
    if(!jobName) return  printf('当前项目不支持git jenkins发布')
    const jenkins = jenkinsApi.init(config.jenkinsApi);
    if(!await isEixtJob(jobName)){
        if(props.createJob === true || props.createJob === 'true'){
            await createJenkins(props,config,message);
        }else{
            return printf(['当前项目还未创建jenkins','可执行进行创建'])
        }
    }
    printf(`正在执行jenkins job: ${jobName}`);
    if(await buildJob()){
        printf(`jenkins job 调用成功`);
        printf(`执行详情请查看: ${config.jenkinsPath}/jenkins/job/${jobName}`);

    }else{
        printf.error(`jenkins job: ${jobName}调用失败`);
    }
    async function buildJob() {
        return new Promise((resolve,reject)=>{
            jenkins.build(jobName,{},(err,data)=>{
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







