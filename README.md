# Etherpad Page View

<img src="http://i.imgur.com/tanIwza.png" alt="Page view">

Add support to do 'page view' with a toggle on/off option in Settings.  

Features:
* Ability to turn on/off page view
* Setting to turn on/off page view
* Setting Persistance
* Ability to add page breaks (Using Control Enter)
* Automatic detection of page length to create pages
* Toggle on/off Line Numbers support without breaking styling
* Toggle Page breaks Visibility
* Maintain page breaks when in non-page view.

## Set page view as default

1. Open `settings.json`
2. Append:
   `"ep_page_view_default" : true,`

## Disable change of page view setting in UI
1. Open `settings.json`
2. Append:
   `"ep_page_view_disable_change" : true,`

## Embed parameter
Suffix this on your pad URL to auto display page view when opening a pad ``&pageview=true``

## License
Apache 2.

## Donations
Donations can be made via http://etherpad.org
