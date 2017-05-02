# c-through

C-Through is a prototype for interactive 3D urban planning analysis on the web based on the ArcGIS JS API 4.3. The application visualizes and analysis 3D features according to user preferences and makes it possible to select and filter specific buildings, floors and units by attributes for further investigation. Charts and statistics are available according to selection and filtering. The application was implemented in the scope of an internship at Esri R&D Zurich and initially featured data from three locations: Zurich, Vancouver and Dubai. Those datasets are not publicly available.

[View it live](https://arcgis.github.io/c-through/)

The following demo application shows imaginary buildings and usage data. Its purpose is to give access to the code base and to show how the application was implemented with the ArcGIS JS API. To learn more about the background and data processing as well as details and challenges about the implementation, review the following resources: 
* <a target="blank" href="https://blogs.esri.com/esri/arcgis/2017/04/12/c-through-a-prototype-for-interactive-3d-urban-planning-analysis-on-the-web/">ArcGIS Blogpost</a>
* <a target="blank" href="https://www.youtube.com/watch?v=KGClZF3Gcss">Explanatory Video</a> 

## Instructions

1. Fork and then clone the repo.
2. Run and try the sample.

The application is designed in a way that it can also be used for other locations or datasets. The following steps need to be done in order to use the application with your own data:

1. Create a multipatch dataset that contains the following attributes for each feature: 
- building id (int)
- floor level (int)
- usage type (string)
- area (float)

2. Publish the dataset on either ArcGIS Portal or ArcGIS Online: <a target="blank" href="https://blogs.esri.com/esri/arcgis/2017/01/03/72321/">Scene Layer publishing tutorial for ArcGIS Online</a> (beta)

3. Create a webscene and load the scene layer that you have published in step 2

4. Change the following properties of the settings_demo object in the app.js file of the application:
- url-property: change to your Portal URL (or ArcGIS Online)
- webscene-property: fill in the portal item ID of the webscene
- usagename-property: change to attribute name containing usage type
- floorname / OIDname / buildingIDname / areaname: respectively

## Resources
The following APIs have been used to create this application:

* <a target="blank" href="https://developers.arcgis.com/javascript/">ArcGIS JS API 4.3</a>
* <a target="blank" href="https://github.com/Esri/calcite-web">Esri Calcite Web</a>
* <a target="blank" href="https://github.com/amcharts">amCharts</a>
* <a target="blank" href="https://github.com/leongersen/noUiSlider">noUISlider</a>

## Disclaimer

This demo version of c-through is not maintained. There is no support available for deployment or development of the application.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing
Copyright 2017 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt]( https://github.com/ArcGIS/c-through/blob/master/license.txt ) file.





