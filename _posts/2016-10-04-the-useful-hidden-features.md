---
layout:     post
title:      "Ruby's Useful \"Hidden\" Features"
date:       2016-10-04
summary:    Dig deep and unearth some of the secrets of the Ruby Programming Language
categories: ruby
---

Ruby has become my programming language of choice ever since a software engineering course introduced to the langauge in univeristy more than 4 years ago.

During my time working with Ruby, I've encountered plenty of interesting functionality.

This blog post is my attempt to share my experience with some of Ruby's more uncommon features.

### 1. Module#prepend

It's a common idiom in Ruby to _mix in_ additional behaviour to a class via modules:

```ruby
module Cooking
  def cook
    'sizzle sizzle'
  end
end

class Bacon
  include Cooking
end

Bacon.new.cook # => "sizzle sizzle"
```

This pattern works well to share similar behaviours between classes and avoid complexity that arises from inheritance.

Sometimes we want to be able to redefine a method on a class from a module. The [Module#prepend](http://ruby-doc.org/core-2.3.1/Module.html#method-i-prepend) method will let us do just that:

```ruby
module Cooking
  def cook
    'sizzle sizzle'
  end
end

class Bacon
  prepend Cooking

  def cook
    'crackle crackle'
  end
end

Bacon.new.cook # => "sizzle sizzle"
```

This pattern will also allow the use of `super` in the method override to access the original definition:

```ruby
module Cooking
  def cook
    "sizzle sizzle #{super}"
  end
end

class Bacon
  prepend Cooking

  def cook
    'crackle crackle'
  end
end

Bacon.new.cook # => "sizzle sizzle crackle crackle"
```

### 2. RubyVM::InstructionSequence#disasm

The Ruby standard library provides the [RubyVM::InstructionSequence](http://ruby-doc.org/core-2.3.1/RubyVM/InstructionSequence.html) class to give developers access to the interpreter's internals.

We can actually decompile the internal YARV bytecode that is generated for a block of code:

```ruby
code = <<-RUBY
  puts rand(3)
RUBY
puts RubyVM::InstructionSequence.new(code).disasm

# OUTPUT
# == disasm: #<ISeq:<compiled>@<compiled>>================================
# 0000 trace            1                                               (   1)
# 0002 putself
# 0003 putself
# 0004 putobject        3
# 0006 opt_send_without_block <callinfo!mid:rand, argc:1, FCALL|ARGS_SIMPLE>, <callcache>
# 0009 opt_send_without_block <callinfo!mid:puts, argc:1, FCALL|ARGS_SIMPLE>, <callcache>
# 0012 leave
```

For most developers, this will be more of an interesting feature as opposed to useful one. Generally, I have only disassembled Ruby code to learn more about how the interpreter works.

### 3. Overriding the Backtick Method

It's possible to override the [Kernel::`](http://ruby-doc.org/core-2.3.1/Kernel.html#method-i-60) method in the standard library.

Normally, this method is used to execute shell commands directly. But we can change the behaviour:

```ruby
`echo $SHELL` # => "/bin/zsh\n"

def `(command)
  puts "command: #{command}"
end

`echo $SHELL` # => "command: echo $SHELL"
```

A use case of this may be to mock system commands in tests, or to log a command before it is executed. With that being said, most Ruby developers agree that it's probably [best to not user backticks at all]( http://www.hilman.io/blog/2016/01/stop-using-backtick-to-run-shell-command-in-ruby/).

### 4. IRB-fu

I use `irb` all the time to quickly execute code and perform quick debugging. Many developers aren't aware that `irb` comes with its own bag of tricks:

  * The `_` variable is always the last value that the interpreter evaluated.

```ruby
  2.times.map { rand(10) }
  # oops, I forgot to save the result!
  result = _ # => [2, 8]
```

  * Run `irb` with warnings enabled.

    The `-w` flag will enable the interpreter's warning generation.

    Just add `alias irb="irb -w` to your shell's initialization script to permanently enable warnings.

    Here's an example of an interpreter warning you might see:

```ruby
  File.exists?('myfile.txt')
  (irb):1: warning: File.exists? is a deprecated name, use File.exist? instead
  # => false
```

### 5. The `caller` Method

Have you ever started debugging an issue and then quickly wondered how a method was actually called?

That's exactly what Ruby's built-in `caller` method is used for.

The `caller` method returns an array that contains the current stack trace and really helps the developer follow complicated program flow.

```ruby
# in file test.rb
def show_caller
  puts caller
end

show_caller

# OUTPUT
# > ruby test.rb
# test.rb:5:in `<main>'
```

The `caller` method really shines when combined with a debugger like [pry](https://rubygems.org/gems/pry) to dynamically halt the program.

### 6. The `retry` Keyword

Ruby gives us a `retry` keyword that simply re-executes a block code until specified:

```ruby
begin
  num = rand(10)
  puts "Attempt: #{num}"
  raise StandardError
rescue StandardError
  retry unless num == 1
  puts "Success!"
end

# OUTPUT
# Attempt: 5
# Attempt: 9
# Attempt: 9
# Attempt: 3
# Attempt: 2
# Attempt: 6
# Attempt: 4
# Attempt: 1
# Success!
```

The `retry` keyword can be useful for actions that may be unreliable (i.e. flaky API endpoints).

### 7. The `method` Method

Ruby's `method()` method is probably my most-used hidden gem in the standard library.

At any point in execution, we can create an instance of a method at runtime. This instance stores values that are very useful for debugging such as the ***source location***.

Here's an example to show where `Rails.configuration` is defined:

```ruby
require 'rails'
method = Rails.method(:configuration)
method.source_location # => ["/Users/jesse/.rvm/gems/ruby-2.3.0/gems/railties-5.0.0/lib/rails.rb", 43]
```

If you have the [method_source](https://rubygems.org/gems/method_source) gem installed on your system, then you can also view the raw source code of the method:

```ruby
require 'method_source'
require 'rails'

method = Rails.method(:configuration)
puts method.source

# OUTPUT
# def configuration
#   application.config
# end
```

I'm sure that this list just scratches the surface for Ruby's hidden functionality. Feel free to let me know if you think there is something missing from this list!
