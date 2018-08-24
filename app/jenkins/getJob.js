const groupList = ['web','nodejs','qckj'];
module.exports = function (group,name,env) {
    if(groupList.indexOf(group) === -1) return;
    let jobName = 'Packing_SC_'+name.substr(0,1).toUpperCase()+name.substr(1);
    if(env === 'dev'){
        jobName = 'Online-35/job/'+jobName+'_35'
    }else if(env === 'release'){
        if(group === 'web'){
            jobName = 'Online-Static/job/'+jobName
        }else if(env === 'nodejs'){
            jobName = 'Online-Node/job/'+jobName
        }else if(env === 'qckj'){
            jobName = 'Online-Java/job/'+jobName
        }
    }else{
        return
    }
    return jobName
}

module.exports.copyJob = function (group,name,env) {

}