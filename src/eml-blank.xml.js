var emlTemplate = `<eml xmlns:eml="eml://ecoinformatics.org/eml-2.1.1" xmlns:dc="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="eml://ecoinformatics.org/eml-2.1.1 http://rs.gbif.org/schema/eml-gbif-profile/1.1/eml.xsd" packageId="https://ipt.gbif.no/resource?id=test/v1.1" system="http://gbif.org" scope="system" xml:lang="eng">
   <dataset>
      <alternateIdentifier />
      <title xml:lang="eng" />
      <creator>
         <individualName>
            <givenName />
            <surName />
         </individualName>
         <organizationName />
         <positionName />
         <address>
            <deliveryPoint />
            <city />
            <administrativeArea />
            <postalCode />
            <country />
         </address>
         <phone />
         <electronicMailAddress />
         <onlineUrl />
         <userId directory="http://orcid.org/" />
      </creator>
      <metadataProvider>
         <individualName>
            <givenName />
            <surName />
         </individualName>
         <organizationName />
         <positionName />
         <address>
            <deliveryPoint />
            <city />
            <administrativeArea />
            <postalCode />
            <country />
         </address>
         <phone />
         <electronicMailAddress />
         <onlineUrl />
         <userId directory="http://orcid.org/" />
      </metadataProvider>
      <associatedParty>
         <individualName>
            <givenName />
            <surName />
         </individualName>
         <organizationName />
         <positionName />
         <address>
            <deliveryPoint />
            <city />
            <administrativeArea />
            <postalCode />
            <country />
         </address>
         <phone />
         <electronicMailAddress />
         <onlineUrl />
         <userId directory="http://orcid.org/" />
         <role />
      </associatedParty>
      <pubDate />
      <language />
      <abstract>
         <para />
      </abstract>
      <keywordSet>
         <keyword />
         <keywordThesaurus />
      </keywordSet>
      <additionalInfo>
         <para />
      </additionalInfo>
      <intellectualRights>
         <para>
            This work is licensed under a
            <ulink url="http://creativecommons.org/licenses/by/4.0/legalcode">
               <citetitle>Creative Commons Attribution (CC-BY) 4.0 License</citetitle>
            </ulink>.
         </para>
      </intellectualRights>
      <distribution scope="document">
         <online>
            <url function="information" />
         </online>
      </distribution>
      <coverage>
         <geographicCoverage>
            <geographicDescription />
            <boundingCoordinates>
               <westBoundingCoordinate />
               <eastBoundingCoordinate />
               <northBoundingCoordinate />
               <southBoundingCoordinate />
            </boundingCoordinates>
         </geographicCoverage>
         <temporalCoverage>
            <singleDateTime>
               <calendarDate />
            </singleDateTime>
         </temporalCoverage>
         <temporalCoverage>
            <rangeOfDates>
              <beginDate>
                <calendarDate />
              </beginDate>
              <endDate>
                <calendarDate />
              </endDate>
            </rangeOfDates>
         </temporalCoverage>
         <taxonomicCoverage>
            <generalTaxonomicCoverage />
            <taxonomicClassification>
               <taxonRankName />
               <taxonRankValue />
               <commonName />
            </taxonomicClassification>
         </taxonomicCoverage>
      </coverage>
      <purpose>
         <para />
      </purpose>
      <maintenance>
         <description>
            <para />
         </description>
         <maintenanceUpdateFrequency />
      </maintenance>
      <contact>
         <individualName>
            <givenName />
            <surName />
         </individualName>
         <organizationName />
         <positionName />
         <address>
            <deliveryPoint />
            <city />
            <administrativeArea />
            <postalCode />
            <country />
         </address>
         <phone />
         <electronicMailAddress />
         <onlineUrl />
         <userId directory="http://orcid.org/" />
      </contact>
      <methods>
         <methodStep>
            <description>
               <para />
            </description>
         </methodStep>
         <sampling>
            <studyExtent>
               <description>
                  <para />
               </description>
            </studyExtent>
            <samplingDescription>
               <para />
            </samplingDescription>
         </sampling>
         <qualityControl>
            <description>
               <para />
            </description>
         </qualityControl>
      </methods>
      <project>
         <title />
         <personnel>
            <individualName>
               <givenName />
               <surName />
            </individualName>
            <userId directory="" />
            <role />
         </personnel>
         <abstract>
            <para />
         </abstract>
         <funding>
            <para />
         </funding>
         <studyAreaDescription>
            <descriptor name="generic" citableClassificationSystem="false">
               <descriptorValue />
            </descriptor>
         </studyAreaDescription>
         <designDescription>
            <description>
               <para />
            </description>
         </designDescription>
      </project>
   </dataset>
   <additionalMetadata>
      <metadata>
         <gbif>
            <dateStamp />
            <hierarchyLevel>dataset</hierarchyLevel>
            <citation identifier="" />
            <bibliography>
              <citation identifier="" />
            </bibliography>
            <physical>
               <objectName />
               <characterEncoding />
               <dataFormat>
                  <externallyDefinedFormat>
                     <formatName />
                     <formatVersion />
                  </externallyDefinedFormat>
               </dataFormat>
               <distribution>
                  <online>
                     <url function="download" />
                  </online>
               </distribution>
            </physical>
            <resourceLogoUrl />
            <collection>
               <parentCollectionIdentifier />
               <collectionIdentifier />
               <collectionName />
            </collection>
            <formationPeriod />
            <specimenPreservationMethod />
            <livingTimePeriod />
            <jgtiCuratorialUnit>
               <jgtiUnitType>countrange</jgtiUnitType>
               <jgtiUnitRange>
                  <beginRange />
                  <endRange />
               </jgtiUnitRange>
            </jgtiCuratorialUnit>
            <dc:replaces />
         </gbif>
      </metadata>
   </additionalMetadata>
</eml>`;

export default emlTemplate ;
