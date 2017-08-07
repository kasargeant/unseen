# Unseen API Documentation

**NOTE: ALL DOCUMENTATION EXPLORATORY AND IN DRAFT FORM.**


## Overview

*Unseen* utilises a standard MVC design as its base for delivering SPAs and other web application UIs.  

It is data-centric in it's design.  It attempts to 'wrap' the existing data as-is - rather than force it into a pre-defined format.

And it's data-driven in it's functioning.  Where the most typical out-the-box setup will automatically sync and "push" data updates forward to views without need for any 'controller' code.

Additionally, there are two signalling mechanisms built into all Unseen components:- Custom events for broadcasting and component-to-component direct messaging.  These add a lot of loosely-coupled flexibility when implementing complex or high-performance applications.

## The Components

As already mentioned, Unseen has an MVC design structure.  It believes strongly in separation of layers and concerns - and the entire implementation is an attempt to do this in an easy and unintrusive way.

Thus we have:-

* **Data components** - Much more than just a bunch of data objects - they can carry methods for validating and modifying their data as events change.  And also handle all aspects of the retrival, storage and synchonisation of remote datasources.

* **View components** - Template or script-based browser and mobile visual widgets.  Designed to render efficiently - and not block the page - no matter how much data they're given.

* **Control components** - Components to control the application's routing, event-handling and security.

### The Data Components

#### Schema

A record **Schema** is the fundamental 'building-block' of Unseen.  Essentially it is a simple JS/JSON object that defines some data's structure and default values.  
And within the Schema object, **keys** represent **field names** and **values** represent **default values**.  

For example, a personal account record might have the default schema of:-

    {id: null, name: "Unknown", balance: 0, isSubscribed: false}


#### Model

A **Model** contains a single data record valid for it's schema.

Getters and setters are automatically generated for the model data's properties.

#### ModelList

A **ModelList** is just that... a list of data Models.  It represents data much the same as a table in a database.

#### ModelCollection

A **ModelCollection** contains all the various data Models and ModelLists to be used by an application.

Data contained may have been sourced remotely from a server, or locally from some store or another JS component.

### The View Components

#### View class

A **View** presents the data of the Model or Models that back it to the user.  It renders the model data using a defined template to create the final markup or markdown result.

#### The ViewList class

A **ViewList** is a View that is backed by a ModelList's data.  It may it's own rendered visuals - but essentially, it manages the subviews that are its list items.

#### ViewCollection class

A **ViewCollection** class contains all Views and ViewLists that an application contains.

### The Control components

#### Router

A **Router** class...
TODO - Router documentation...

Additionally, there are a few more minor helpers:-



## INSTALLATION

    npm install

## USAGE

I'm still working it out...
