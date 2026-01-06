# git 相关技术问题记录

## git 配置 user.name 和 user.email

1.首先查看有没有配置 user.name 和 user.email(没输出则没有)

```bash
git config user.name
git config user.email
```

2.设置 user.name 和 user.email

```bash
git config --global user.name "your_username"  # 配置用户名
git config --global user.email "your_email"  # 配置邮箱
```
