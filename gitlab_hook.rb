require "open-uri"

CONF = {
  # 远程自动化部署服务
  "deployserver" => '172.19.14.199:5556'
}

# 检测分支是否存在
def branch_isexist name
  branchs = `git branch`.split(/\n/)
  branchs.each { |line|
    if line.sub(/\s+/, '') == name
      return true
    end
  }
  return false
end

# 输出彩色屏幕
def color string, style=0
  return "\033[#{style}m#{string}\033[0m"
end

# 解析组和项目
def repoParse path
  if /([^\/]+)\/([^\.\/]+)\.git$/ =~ path
    return {
      "group" => $1,
      "project" => $2
    }
  end
end

# 更新前 hook
def localscript_before *params
  ret = before_handle(*params) != false
  unless ret
    puts ""
    puts color "需要帮助请联系 @墨净", 33
  end
  return ret
end

# 更新后 hook
def localscript_after *params
  after_handle *params
  puts ""
  puts color "需要帮助请联系 @墨净", 33
end

# 提交前拦截
def before_handle repo_path, refs
  _, sha1, ref_name = refs.split(/\s+/)
  # 检测是否在自动化部署的分组中
  # 并给出宣传提示
  repo = repoParse repo_path
  # 处理前端自动化分组提交
  if /refs\/(heads|tags)\/(.*)/ =~ ref_name
    branch = $2
    # tag提交预检测
    if $1 == 'tags'
      unless /^release\/(\d+\.\d+\.\d+)$/ =~ branch
        puts color("错误：tag必须使用类似", "31;1") + color(" release/1.0.0 ", "33;1") + color("3位版本格式", "31;1")
        return false
      end
    # 分支预检测
    else
      unless /^dev\/(\d+\.\d+\.\d+)$/ =~ branch
        puts color "警告！", "33;1"
        puts color("分支名使用", 33) + color(" dev/1.0.0 ", "33;1") + color("3位版本格式", 33)
      end
    end
  end
end

# 提交后脚本
def after_handle repo_path, refs
  ref_name = refs.split(/\s+/).pop()
  repo = repoParse repo_path
 
  if /refs\/(heads|tags)\/(.*)/ =~ ref_name
    branch = $2
    # tag处理
    if $1 == 'tags'
      if /^release\/(\d+\.\d+\.\d+)$/ =~ branch
        # 部署到线上环境
        deployserver repo['group'], repo['project'], branch, 'release'
      end
      return
    end
    commit = `git log #{branch} -1 --pretty=format:"%s"`
    if /^dev(:|$)/ =~ commit
      deployserver repo['group'], repo['project'], branch,'dev'
      return
    end  
    if /^pre(:|$)/ =~ commit
      deployserver repo['group'], repo['project'], branch,'pre'
      return
    end 
  end
end

# 调用远程自动化部署服务
def deployserver group, project, branch, env
  url = "http://#{CONF['deployserver']}/webhook.json?group=#{group}&project=#{project}&branch=#{branch}&env=#{env}"
  puts color url,36
  open(url) do |http|
    puts http.read
  end
end
