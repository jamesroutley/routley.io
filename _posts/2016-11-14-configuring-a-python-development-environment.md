---
layout: post
title: "Configuring a Python Development Environment"
date: 2016-11-28
categories: london
---

This article outlines how to set up a Python development environment, and introduces tools to aid development work. This article is intended for those who are unfamiliar with Python, but have experience using a text editor and the command line. The Python language itself is not covered.


## Sections

- [Installation](#installation)
- [Running Python Code](#running-python-code)
- [Packages](#packages)
- [Virtual Environments](#virtual-environments)
- [Linting](#linting)
- [Debugging](#debugging)


## Installation

Python can be installed in the following ways:

Mac (assumes [Homebrew](http://brew.sh/) is installed):

~~~
brew install python
~~~

Windows: download and run the [installer](https://www.python.org/downloads/).

Linux:

~~~
sudo apt-get install python
sudo yum install python
~~~

For more information on installing Python, check this [guide](http://docs.python-guide.org/en/latest/starting/installation/).


## Running Python Code

### Interactive Interpreter

An interactive Python interpreter can be brought up by typing `python` into your terminal. This starts a Python REPL (Read–eval–print loop) which executes each command as it is entered and displays the result:

~~~
>> print "hello"
hello
>> 1 + 1
2
~~~

To exit the interpreter, type `exit()` and press `enter`.

While the interpreter is useful for testing out ideas, Python will mostly be used by writing programs and running them.


### Programs

Python programs are a file or set of files when contain a series of python commands. Python programs can be run from the cli using the syntax:

~~~
$ python <path/to/python_file>
~~~

e.g:

~~~
$ ls
program.py
$ cat program.py
print "hello"
$ python program.py
hello
~~~

## Packages

### pip

Packages in Python are managed by the tool `pip`. `pip` is a recursive acronym which stands for "pip installs packages". Pip should be installed alongside Windows and Mac Brew installations of Python. Pip can be installed on linux with `apt-get` or `yum` installing `python-pip`.

To install a package, run:

~~~
pip install <package_name>
~~~

Python has a rich collection of packages, and before implementing something, it's worth Googling to see if it's been done before. Packages are listed on the [Python Package Index](https://pypi.org/).

For example, the library [requests](http://docs.python-requests.org/en/master/) can be installed by running:

~~~
$ pip install requests
~~~

To see what packages have been installed, run:

~~~
$ pip freeze
requests==2.11.1
~~~

To uninstall a package, run:

~~~
$ pip uninstall requests
~~~

### Versioning

When writing new programs, the latest version should usually be used. In the pip commands above, pip downloaded the latest version of that package, as no version number was specified. There are however, some times when a particular package version should be installed. This can be done with:

~~~
$ pip install <package_name>==<version_number>
~~~

e.g:

~~~
$ pip install requests==2.0.0
~~~


### Multiple requirements

The packages required by a program are conventionally added to a file named `requirements.txt`. This allows other developers to install all requirements with a single command:

~~~
$ pip install -r requirements.txt
~~~


## Virtual Environments

When using `pip`, packages are installed globally for the user in question. This can cause problems if two separate programs require different versions of the same package. For example, a developer could be simultaneously working on two programs, A and B. Program A may depend on the package `requests` version 0.9, whereas B depends on `requests` version 1.3, where versions 0.9 and 1.3 of `requests` are incompatible. To work on A, the developer must install v0.9. To switch over and work on B requires the developer to `pip uninstall requests` and `pip install requests==1.3`. The opposite process must be performed to switch back to working on A.

Virtual environments allow Python packages to be installed non-globally. This allows the above developer to work on A and B simultaneously without having to uninstall and reinstall `requests`. Virtual environments work by installing packages to a folder specified by the user, rather than the global folder. Virtual environments are managed by the tool `virtualenv`. This can be installed with:

~~~
$ pip install virtualenv
~~~

A virtualenv can be created with:

~~~
virtualenv <name of virtualenv>
~~~

Virtual environments are conventionally named `venv`, and are created with:

~~~
virtualenv venv
~~~

Running this command will create a new folder named `venv`. For a virtualenv to work, it must be activated:

~~~
source venv/bin/activate.sh
~~~

When a virtual environment is activated, it prepends the name of the environment to XXX. When a virual env is activated, all packages which are pip installed are installed to `venv/lib/pythonX.X/site-packages`.

Using virtual environments is best practice, and should always be done.


## Linting

Styling code in a common, expected way should be done to improve its readability. Multiple tools exist for doing this, one of which is outlined here.

Flake8 is a CLI tool which checks code for compliance with two documents, PEP8 and PyFlakes. Flake8 can be installed with pip:

~~~
pip install flake8
~~~

Flake8 can lint a python file with:

~~~
flake8 <file>.py
~~~

Flake8 can lint all python files in a directory its subdirectories with:

~~~
flake8 <directory>
~~~

Flake8 can also be added as a plugin to most text editors, so it checks code as it is written.

Compliance with Flake8 is best practice, and all Python code should do so.

For example, the following code has too many blank lines between the two `print` statements. Flake8 alerts the user to this.

~~~
$ cat demo.py
print "hello"



print "world"
$ flake8 demo.py
demo.py:5:1: E303 too many blank lines (3)
~~~


## Debugging

When code isn't running as it is supposed to, it is useful to check the state of variables in the broken section of code. This can be done by printing out variables, but it can be quicker to do this using a debugger. The builtin debugger is named `pdb`. `pdb` is often used through the function `set_trace()`. As a program is executed, when the function `set_trace()` is called, execution is paused, and the user is dropped into an interactive REPL session. From this session, the user has access to all variables which in scope at the line where `set_trace()` has been added. For example:

~~~ python
# debug.py
import pdb

def func():
    a = 10
    pdb.set_trace()
~~~

Running this code:

~~~ shell
$ python debug.py
--Return--
> /private/tmp/t/debug.py(6)func()->None
-> pdb.set_trace()
(Pdb)
(Pdb) print a
10
~~~

After debugging is done, the user can continue the execution of the program by typing "c", which stands for continue.
