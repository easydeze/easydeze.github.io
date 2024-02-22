---
layout: archive
title: "Curriculum Vitae"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

Rice University student majoring in Computer Science and Mathematics. 


# Education
{% for position in site.data.cv_education %}
  {% include cv_position.html %}
{% endfor %}


# Professional Experience
{% for position in site.data.cv_positions %}
  {% include cv_position.html %}
{% endfor %}


# Publications
<ul>
{% for post in site.publications reversed %}
  {% assign cv_venues = "research-paper,poster" | split: "," %}
  {% if cv_venues contains post.venue-type %}
    {% include archive-single-cv.html %}
  {% endif %}
{% endfor %}
</ul>


# Featured Projects
* [Todoify](https://github.com/easydeze/to-do-list): Developed a full-stack web application that organizes to-do items using an inbox/calendar system. Store projects, folders, and to-do items in JSON format to localStorage in the user’s computer using the Web Storage API (JavaScript, HTML, CSS, FlexBox, Webpack, NPM, Git).
* [Natural Language Processing](https://github.com/easydeze/natural-language-processing): Performed English part-of-speech (POS) tagging using Hidden Markov Models and Bayesian Inference on 2,000,000 training words. Implemented Viterbi’s algorithm on bigram and trigram models to achieve up to 97% accuracy on testing data of 900+ words (Python).
* [CovidScreen](https://devpost.com/software/covidscreen): Built a web application that predicts whether user has COVID-19 through a series of diagnostic questions using JavaScript events (ReactJS, JavaScript, HTML, CSS, MaterialUI, Git).


# Technical Skills
* Programming Languages: Proficient in Python, Java, C++, C, JavaScript, R.
* Mobile Development: Swift, Kotlin, GraphQL.
* Web Development: ReactJS, HTML, CSS.

# Leadership
* Webmaster and Promotions Chair of the [Rice Pre-Medical Society](https://www.ricepremed.com/).
