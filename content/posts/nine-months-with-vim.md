---
aliases:
  - /tech/2018/03/11/nine-months-with-vim
date: "2018-03-11"
layout: post
title: Nine months with Vim
---

Over summer, I attended the Recurse Center. I noticed that around half the
people in my batch were using Vim, and figured it would be a good time to try it
out. I ran into two difficulties:

1. I knew the basics of using Vim but I was less efficient than with my previous
   editor, [Visual Studio Code](https://code.visualstudio.com/)
2. I didn't know how to configure Vim to use the syntax highlighting,
   indentation and linters I was used to. I was trying out lots of different
   programming languages, and needed to set Vim up for each one separately.

I decided to deal with these problems separately. I focused on the former by
using a preconfigured Vim setup to defer having to think about the latter.

## Initial Vim configuration

I installed Amir Salihefendic's [vimrc](https://github.com/amix/vimrc). It
provided a really good starting point, and I'd recommend it to people who don't
want to roll their own config.

Once I felt productive at using Vim, I decided to write my own Vim
configuration. This let me address some minor issues I had:

- I found it difficult to understand which features were and built into Vim, and
  which came from the `vimrc`
- The `vimrc` contained features I didn't use
- The `vimrc` vendored packages into the repo. To add new things, I needed to
  use git submodules, a lower level of abstraction than I wanted to use
- I forked the repo to make some changes. Maintaining the fork and keeping
  everything up to date was a lot of effort

## Current Vim configuration

I wanted a configuration that was:

- Language agnostic and supported a wide range of languages
- Minimal and close to native Vim where possible
- Easy to edit and used a modern package manager

You can see my full configuration on
[GitHub](https://github.com/jamesroutley/nvim/blob/master/init.vim). It's just
over 100 lines of code, including comments and newlines.

### File navigation

I use Tim Pope's [vim-vinegar](https://github.com/tpope/vim-vinegar) to interact
with the filesystem and open files. It's a thin wrapper around Vim's built in
`netrw`. When editing a file, pressing `-` opens a listing of that file's parent
directory. Pressing `-` again to moves you up a directory. To find a particular
directory or file, I use the normal Vim search (`/`).

I've heard good things about fuzzy finders such as
[fzf](https://github.com/junegunn/fzf.vim), but haven't used them myself.

### Splits and tabs

I use both tabs and splits to edit multiple files. At work I mostly code on a
large number of microservices written in Go. I'll use one tab per service, and
two or three splits per tab.

To open splits, I've mapped `=` to open the current file in a vertical split. I
use this in conjunction with `vim-vinegar`'s `-` command to quickly open files
from the same package/directory in a new split.

I don't currently interact with the open buffer list directly.

To move between splits, I've added the mappings `ctrl+<h/j/k/l>`:

```vim
" Easy split navigation
map <C-j> <C-w>j
map <C-k> <C-W>k
map <C-h> <C-W>h
map <C-l> <C-W>l
```

To create new tabs I use `T`, and to switch between them, I use `alt+<h/l>`:

```vim
" Simplify using tabs
nnoremap ˙ gT
nnoremap ¬ gt
nnoremap T :tabnew<cr>
```

### Language support

I use two plugins to get decent Vim support for most languages I'll ever use:

- [vim-polyglot](https://github.com/sheerun/vim-polyglot): Syntax highlighting
  and correct indenting
- [Asynchronous Line Engine (ALE)](https://github.com/w0rp/ale): Linting

### Interacting with code

I use a couple of small plugins which make writing code marginally easier. The
features they implement come built into Visual Studio Code:

- [vim-commentary](https://github.com/tpope/vim-commentary): Comment out lines
  or blocks of code. It works for most languages I've tried
- [auto-pairs](https://github.com/jiangmiao/auto-pairs): When you type a left
  parenthesis, it automatically types a right parenthesis and moves your cursor
  between the two
- [vim-gitgutter](https://github.com/airblade/vim-gitgutter): Display a green
  `+` or a red `-` next to columns that have been edited in a file
- `:set colorcolumn = 80`: Display a faint line at 80 chars

### Package management

I use Junegunn Choi's [vim-plug](https://github.com/junegunn/vim-plug) as my
package manager. I like its simple API (add GitHub repos, run `PlugInstall`). It
operates at a higher level of abstraction than
[Pathogen](https://github.com/tpope/vim-pathogen) or Vim 8's native package
loading in that you don't interact with your plugins' files directly. This feels
familiar if you're used to brew/apt-get/pip etc.

### Logbook

To simplify writing my
[logbook](https://routley.io/tech/2017/11/23/logbook.html), I wrote a Vim
plugin, [vim-logbook](https://github.com/jamesroutley/vim-logbook) which lets me
easily open today's logbook and add timestamps.
