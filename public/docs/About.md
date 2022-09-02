<h1 align="center">About Scripterra Project</h1> 


```sh
------------------------------------------------------------------
  _________            .__        __
 /   _____/ ___________|__|______/  |_  _______________________
 \_____  \_/ ___\_  __ \  \____ \   __\/ __ \_  __ \_  __ \__  \
 /        \  \___|  | \/  |  |_> >  | \  ___/|  | \/|  | \// __ \_
/_______  /\___  >__|  |__|   __/|__|  \___  >__|   |__|  (____  /
        \/     \/         |__|             \/                  \/
-------------------------------------------------------------------
```

<p>Most developers sooner or later come across writing scripts that are not directly integrated into the application code.</p> 

<p>Thus, tones of javascript files are created that are not related to each other. 
They perform a certain action, for example, according to the schedule, they get information from a third-party api and write it to the database or something like that.</p> 

<p>It's not a bad approach when there are no more than 5 such files. 
But let's imagine that there are 30 such files? Each separate file is a separate javascript code that does something on a schedule or on a call.</p>

* What about the dependencies? 

* Or what about the dubbing of the code? 

* What about the logs? 

* What if you have many projects that require one script but different configs for it? 

<p>To solve these problems, the Scripterra scripting engine was developed, 
which removes the need to worry about dubbing, configs, deploy and cron.</p>