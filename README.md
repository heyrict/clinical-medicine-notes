Clinical Medicine Notes
======

该项目为各门临床课程个人整理笔记的汇总。掌握要求为南京医科大学五年制临床专业要求。

Syntax
------

因不同笔记制作时间跨度较大，不同笔记的标记会略有不同。
通用标记如下：

| 标记                 | 含义          |
|----------------------|---------------|
| `<!--IMPORTANT-->`   | 重点          |
| `<!--TODO: {...}-->` | 待补充/确认等 |
| `<!--\r.*\r -->`     | 备注          |

Contribute
------

如果发现错误或遗漏，欢迎在Issues提出。
如果想要进行大规模的修改，可以提出Pull Request。具体操作方法如下：

1. 如果没有Github帐号，注册一个帐号。
1. 点击Fork，将项目克隆至自己的帐号下。
1. 进行修改（建议新建分支，分支名为修改内容）。
1. 提交合并申请（Pull Request）。

Anki
----

使用 `.yaml` 文件生成可供 Anki 使用的 `.csv` 文件方法

### Prerequisites

- [Python 3.X](https://www.python.org/downloads): 支持最新版的 Python，不除外部分较早版本 (如 < 3.6) 有可能存在兼容性问题
- [Just](https://github.com/casey/just): 这是一个预定义命令运行用的软件
- (Windows 用户) 请安装 bash 运行环境 (如 [Git bash](https://gitforwindows.org/) 或 Cygwin 或 WSL)

**注意事项**

- Windows 用户: 请确保 `python.exe` 及 `just.exe` 的程序能在环境变量 `%PATH%` 中找到；必要时可以将 `just.exe` 拷贝一份至 `C:\Windows\System32` 内
- Mac 用户: 建议使用包管理器 (如 `brew`) 安装依赖
- 安装好 Python 后，请 `cd` 到本目录并安装需要用到的 python 包: `pip install -r requirements.txt`
- Linux 用户 (以 Arch 为例)

  ```sh
  # pacman -Sy
  # pacman -S python python-virtualenv just
  $ python -m virtualenv anki_env
  $ source anki_env/bin/activate
  $ cd /path/to/clinical-medicine-notes
  $ pip install -r requirements
  ```

### Generate Anki-csv files

1. `cd` 至包含 `justfile` 且包含 Anki flashcards 的文件夹
2. 运行 just 命令 `just convert_all` 或者 `just convert_csv flashcards/filename` (命令因 `justfile` 内容而异)
3. 以上命令将生成 `.yaml` 文件对应的 `.csv` 文件，可以将该文件导入 Anki;
   `*_qa.csv` 对应 Anki 的 `Basic` 卡片类型;
   `*_cloze.csv` 对应 Anki 的 `Cloze` 卡片类型
4. `*_qa.csv` 一般为 4 - 5 列 (UUID, Front, Back, created_time\[, tags\])
5. `*_cloze.csv` 一般为 3 - 4 列 (UUID, cloze, created_time\[, tags\])
6. 新建 `Note` 类型时建议按照上述列名顺序排列各字段，卡片模板请参考 [Card styling](#card-styling)
7. 导入文件时请注意，`Field seperator` 请设置为 `Comma`, `Allow HTML in fields` 请设置为 `True`

```zsh
cd /path/to/clinical-medicine-notes\content\Internal
just convert_all
```

### Card styling

- Basic front template

  ```html
  <div class="flexbox">
  {{Front}}
  </div>
  ```

- Basic back template

  ```html
  {{FrontSide}}
  <hr id=answer>
  <div class="flexbox">
  {{Back}}
  </div>
  ```

- Basic styling

  ```csv
  .card { font-family: arial; font-size: 20px; color: #3c3836; background-color: #ebdbb2; }
  .card.nightMode { color: #ebdbb2; background-color: #000000; }
  .flexbox { display: flex; flex-direction: column; width: 100%; align-items: center; justify-contents: center; }
  p { margin: 5px 0; }
  code { background: rgba(0,0,0,0.1); border-radius: 5px; } code.nightMode { background: rgba(255,255,255,0.1); }
  pre { background: rgba(0,0,0,0.1); padding: 5px 15px; border-radius: 5px; } pre.nightMode { background: rgba(255,255,255,0.1); }
  pre code { background: none; }
  ```

- Cloze front and back template

  ```html
  <div class="flexbox">
  {{cloze:cloze}}
  </div>
  ```

- Cloze styling

  ```csv
  .cloze { font-weight: bold; color: #b58900; } .nightMode .cloze { color: #b58900; }
  .card { font-family: arial; font-size: 20px; color: #3c3836; background-color: #ebdbb2; }
  .card.nightMode { color: #ebdbb2; background-color: #000000; }
  .flexbox { display: flex; flex-direction: column; width: 100%; align-items: center; justify-contents: center; }
  p { margin: 5px 0; }
  code { background: rgba(0,0,0,0.1); border-radius: 5px; } code.nightMode { background: rgba(255,255,255,0.1); }
  pre { background: rgba(0,0,0,0.1); padding: 5px 15px; border-radius: 5px; } pre.nightMode { background: rgba(255,255,255,0.1); }
  pre code { background: none; }
  ```

License
------

Programs (including `justfile`, `**/*.py`, `**/*.js`) are disclosed under [MIT license](https://mit-license.org/).
All other contents in this repository are disclosed under [CC-BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
