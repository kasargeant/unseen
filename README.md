# Unseen [![npm](https://img.shields.io/npm/v/unseen.svg)]() [![Build Status](https://travis-ci.org/kasargeant/unseen.svg?branch=master)](https://travis-ci.org/kasargeant/unseen) [![Build Status Windows](https://ci.appveyor.com/api/projects/status/github/kasargeant/unseen?branch=master&svg=true)](https://ci.appveyor.com/project/kasargeant/unseen)

![Unseen](/docs/shared/img/unseen.png)

## ABOUT

```diff
- NOTE: THIS LIBRARY IS BEING PROTOTYPED.  PLEASE VISIT LATER, FOR SOMETHING A LITTLE MORE STABLE! ;)
```

**Unseen** is a micro-library designed to provide a robust and performant foundation for building SPAs and other front-end applications.

It offers developers an entirely **component-based** and **encapsulated approach** to contructing applications.

That means, no need for separate stylesheets, no need for separate templates, everything handled by JS alone - and all component/widget creation and wiring is done in one place - for maximum productivity and maintainability.

## FEATURES

**Unseen** was given its name for two reasons:-  

* It's main design goal is to be invisible.  That is, to function as automatically as possible, with as little boilerplate as possible.

* And it's main implementation advantage is to utilise and the new Shadow DOM v1 functionality available in modern browsers and mobiles.

As to specific features:-

* Modern **ES2015 design and implementation** - Model and View components created simply using 'extends'.
* **Components encapsulate all markup, style and logic** - with **no bleeding or pollution** of other components or the main page.
* **Cleaner, simpler code and stylesheets** than non-component based applications of equivalent functionality!
* Data models can **sync with a wide variety of back-ends**:- files, REST, [TODO] Socket.IO or [TODO] raw Websockets.
* [TODO] Built-in login, authentication and **baseline security** support.  
* Built-in **component messaging and custom event** support.
* No implicit reliance on any bundler e.g. WebPack (although, Unseen happily works with them all).

## DEMO

A simple live-demo can be found at:- [https://kasargeant.github.io/unseen/demo/](https://kasargeant.github.io/unseen/demo/)

## INSTALLATION

    npm install unseen

## DOCUMENTATION

The [API Documentation](https://kasargeant.github.io/unseen/api/index.html) details the various components that make up Unseen.

And the [Unseen Wiki](https://github.com/kasargeant/unseen/wiki) has a Quick start and various useful links.
