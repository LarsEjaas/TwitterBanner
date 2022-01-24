<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://larsEjaas.com/en/">
    <img src="logo.png" alt="Ejaas Logo" width="80" height="80">
  </a>

  <h3 align="center">Interactive Twitter banner</h3>

  <p align="center">
    An interactive Twitter banner build in Node.js and hosted on Heroku!
    <br />
    <a href="https://twitter.com/LarsEjaas"><strong>Live banner on my Twitter profile »</strong></a>
    <br />
    <br />
    <a href="https://twitter.com/LarsEjaas?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-show-count="false">Don't forget to give me a follow @Twitter</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]](1500x500.jpg)
<br />
<br />

Twitter has an API that makes it possible to pull data like tweets and followers.

This project leverage the API to interact with your list of followers and create an interactive banner that will display your 3 most recent followers.

This banner utilizes a serverless Node.js function that pulls the 3 most recent followers once every minute. Afterward, the function will overlay the follower's profile picture and upload the updated banner to your profile.

There are various places you can run a project like this, but I choose Heroku due to their generous free tier limit.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Get a free API Key for your Twitter profile at [https://developer.twitter.com/](https://developer.twitter.com/)

2. Clone the repo
   ```sh
   git clone https://github.com/LarsEjaas/TwitterBanner.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Create an `.env` file and add the variables listed in `.env.example` replacing the values for the data from the API.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

This project comes with no license. Feel free to shamelessly copy everything...

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Lars Ejaas - [@twitter](https://twitter.com/larsEjaas) - [Write to me directly on my webpage](https://larsEjaas.com/en/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

The code for this project was more or less copied directly from Chris Bongers' article on daily-dev-tips.com:

[How I made my Twitter header dynamic](https://daily-dev-tips.com/posts/how-i-made-my-twitter-header-dynamic/)

Please follow him on Twitter if you like this articles and content:

[@DailyDevTips1](https://twitter.com/DailyDevTips1)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LINKS FOR IMAGES -->

[product-screenshot]: 1500x500.jpg
