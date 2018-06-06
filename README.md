# Takeaway homework

This project it's a demo.

## Getting Started

This demo explains how to use Vue, PHP, PHPUnit for TDD, JSON, Javascript and GULP to sort restaurants list throught a form. [Go to Demo](http://test2.uhorizon.es). 

### Prerequisites

Requires [composer](https://getcomposer.org) and [npm](https://nodejs.org/en/).

### Installing

After you download the source you need to install vendors using composer

```
composer install
```

For Development. Specially for JS & Tests.

```
npm install
```

To combine & minify javascripts 
```
./node_modules/gulp-cli/bin/gulp.js 
```

## Running the tests

To execute phpunit tests

```
./vendor/bin/phpunit tests
```

### Business/Search

This test case is used to verify sort funtionality for each sortingValues field checking the restaurant's name and the sort value.

#### High scores has been first (descent)
* bestMatch
* newest
* ratingAverage
* popularity
* topRestaurants

#### Low scores has been first (ascent)
* distance
* deliveryCosts
* minCost

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Vue](https://vuejs.org) - Used for X-Templates
* [Bootstrap](http://getbootstrap.com) - Used for basic CSS
* [JQuery](https://jquery.com) - Used for AJAX & louApp

## Authors

* **LouisJimenenzP** - *Homework* - [LouisJimenezP](https://github.com/LouisJimenezP)

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc

