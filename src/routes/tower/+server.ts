import { json, type RequestHandler } from '@sveltejs/kit';
import { RadioBrowserApi, StationSearchType } from 'radio-browser-api'
const api = new RadioBrowserApi('RADAPP')

export const POST: RequestHandler = async ({request}) => {

    const cloneRequest = request.clone();

    console.log("hellow");
    

    const  { language, countryCode, tagList } = await cloneRequest.json()

    if (!language || !countryCode || !tagList ) return json({
        status: false,
        message: 'Invalid request parameters'
    })

    try {

        // await api.getStationsBy(StationSearchType.byTag, 'jazz')

        const stations = await api.searchStations({
            language: 'english',
            countryCode: countryCode,
            // tagList: tagList,
            limit: 100,
            offset: 0 // this is the default - can be omited
            })

        if (stations.length > 0) return json({status: true, stations});
        
        return json({status: false, message: 'No Stations Found'});
        
    } catch (error) {
        return json({
        status: false,
        message: 'Error Caught. Try connect to internet.'
    })
    }
};