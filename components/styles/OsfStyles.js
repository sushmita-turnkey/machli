import { StyleSheet } from 'react-native'
var top_container_colour = '#03866d'
//var extendedForecast_container_colour='yellow'
export default StyleSheet.create({

    containerMain: {
        flexDirection: "column",
        flex: 1,
        //paddingTop:80,

    },
    header: {
        
        height: '12%',
        paddingTop: 46,
        paddingBottom: 18,
        flexDirection: "row",
    },

    PFZheader: {
        
        height: '12%',
        paddingTop: 46,
        paddingBottom: 24,
        flexDirection: "row",
        backgroundColor: top_container_colour,
    },

    scrollViewContainer:
    {
        
        flexDirection: "column",
    },

    compassblock:{
        backgroundColor:'transparent',
        marginTop:-186,
    },
  
    profileContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    locationContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    callContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnProfile: {
        backgroundColor: '#ffffff',
        width: 48,
        height: 48,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10, //applied to container
        elevation: 8,
    },
    imgProfile: {
        marginLeft: 2,
        marginTop: 2,
        height: 48,
        width: 48,
    },
    text: {
        color: '#000000',
        //fontWeight: "bold",
        fontFamily: 'CircularStd-Black',
        opacity: 0.6,
        fontSize: 20, /*paddingBottom: '4%'*/
        textAlignVertical: 'center'
    },

    textLocation: {
        color: '#000',
        fontSize: 16,
        fontFamily: "CircularStd-Bold",
        textAlignVertical: 'center'
    },

    btnLocation: {
        flexDirection: 'row',
        height: 48,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#ffffff',
        padding: 16,
        elevation: 4,
    },
    imgLike: {
        height: 22,
        width: 22,
        marginLeft: 8
    },
    btnCall: {
        backgroundColor: '#000',
        width: 48,
        height: 48,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10, //applied to container, And this is for inside
        elevation: 10,
    },
    imgCall: {
        height: 48,
        width: 48,
    },
    DistanceMainContainer: {

        paddingTop: 24,
        paddingBottom: 0,
        flexDirection: "row",
        paddingLeft: 16,
        paddingRight: 16,

    },
    distanceContainer1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    distanceContainer2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    distanceContainer3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnDistance: {
        flexDirection: 'row',
        height: 36,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'flex-start',
        //backgroundColor: '#ffffff',
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 32,
        paddingRight: 32,
    },
    textDistance: {
        fontSize: 16,
        textAlignVertical: 'center',
        fontFamily: "CircularStd-Bold"
    },

    messageContainer: {
        backgroundColor:top_container_colour,
        width:'100%',
        paddingBottom: 10,

    },

    PFZmessageContainer: {
        backgroundColor: top_container_colour,
        width:'100%',
        paddingBottom: 210,

    },

    messageBox: {
        flex: 1,
        paddingTop: 40,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },

    PFZmessageBox: {
        flex: 1,
        paddingTop: 20,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },

    textMessageHeading: {
        color: '#ffffff',
        fontSize: 12,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontFamily: "CircularStd-Bold",
        letterSpacing: 1.2,
        lineHeight: 15,
        opacity: 0.5,
        textTransform:'uppercase',
    },

    texHeading: {
        color: '#ffffff',
        fontSize: 15,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontFamily: "CircularStd-Bold",
        letterSpacing: 1.2,
        lineHeight: 20,
        opacity: 0.5,
    },


    textMessage: {
        color: '#ffffff',
        paddingTop: 16,
        paddingBottom: 6,
        fontSize: 16,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontFamily: "CircularStd-Medium",
        lineHeight: 26,
    },
    textMessageDate: {
        fontFamily: "CircularStd-Medium",
        color: 'rgba(255,255,255, 0.5)',
        fontSize: 12,

        textAlignVertical: 'center',
        textAlign: 'center',
        lineHeight: 15,
    },

    infocontainer: {
        flexDirection: "column",
        zIndex: 2,
        paddingBottom: 16,
        backgroundColor:'red'    
        
    },

    PFZinfocontainer: {
        flexDirection: "column",
        zIndex: 2,
        paddingBottom: 10,
       
    },
    
    middlebtnContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 24,
        paddingTop: 12
    },

    btnMiddle: {
        flex: 1,
        flexDirection: 'row',

        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: 16,
        paddingLeft: 24,
        paddingRight: 24,
    },
    btnListen: {
        height: 14,
        width: 20,
        marginRight: 12,
    },

    textMiddle: {
        marginLeft: 15,
        color: '#fff',
        fontSize: 16,
        fontFamily: "CircularStd-Bold",

    },

    bottomContainerStyle: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        elevation: 4,
        zIndex: 10,
        marginTop: -24,

    },

    bottomContainer: {
        paddingBottom: 15,
        paddingTop: 10,
        flexDirection: "column",
        flex: 1,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,



    },


    bottomContainer2: {
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 32,
        paddingRight: 32,
        flexDirection: "row",
        flex: 1,
        justifyContent: "flex-start",


    },
    bottomContainer21: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',

    },
    bottomContainer22: {
        flex: 4,
        paddingLeft: 10,
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexDirection: 'column',


    },
    bottomContainer23: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'column',

    },
    imgWaves: {
        height: 42,
        width: 42,
    },
    textBottomMiddlePrimary1: {
        color: '#53aad7',
        //fontWeight: 'bold',
        fontSize: 16,
        textAlignVertical: 'center',
        justifyContent: 'flex-start',
        lineHeight: 18,
        fontFamily: "CircularStd-Bold",

    },
    textBottomMiddlePrimary2: {
        color: '#0a4a81',
        //fontWeight: 'bold',
        fontSize: 16,
        lineHeight: 18,
        fontFamily: "CircularStd-Bold",
        textAlignVertical: 'center',
        justifyContent: 'flex-start'
    },

    textBottomMiddlePrimary3: {
        color: '#c1af87',
        //fontWeight: 'bold',
        fontSize: 16,
        lineHeight: 18,
        fontFamily: "CircularStd-Bold",
        textAlignVertical: 'center',
        justifyContent: 'flex-start'
    },
    textBottomMiddleSecondry1: {
        fontFamily: "CircularStd-Medium",
        fontSize: 14,
        lineHeight: 21,
        textAlignVertical: 'center',
        justifyContent: 'flex-start',
        color: '#4B4A4C'
    },

    textBottomMiddleSecondry2: {
        fontFamily: "CircularStd-Medium",
        fontSize: 14,
        lineHeight: 21,
        textAlignVertical: 'center',
        justifyContent: 'flex-start',
        color: '#4B4A4C'
    },

    textBottomEndQuantity: {
        color: '#03866d',
        fontSize: 30,
        lineHeight: 32,
        fontFamily: "CircularStd-Bold",
        textAlignVertical: 'center',
        justifyContent: 'flex-start'
    },
    textBottomEndQuantityUnit: {
        color: '#4b4a4c',
        fontFamily: 'CircularStd-Medium',
        fontSize: 13,
        lineHeight: 16,
        opacity: 0.5,
        textAlignVertical: 'center',
        justifyContent: 'flex-start'
    },

    btnExtendedForecastContainer: {
        padding: 24,
        marginTop: 12,
        paddingBottom: 16,
        flexDirection: "row",
        flex: 1,
        justifyContent: "center",
        
    },
    btnExtendedForecast: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.10)',
        padding: 20,
    },
    textExtendedForecastbtn: {
        color: 'rgba(0,0,0,0.74)',
        fontFamily: 'CircularStd-Medium',
        fontSize: 16, 
        lineHeight: 22,
        textAlignVertical: 'center',
        textAlign: 'center',
    },

    ExtendedForecastContainer: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: '#fff',
        paddingBottom: 24,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    ExtendedForecastContentContainer: {
        flex: 1,
        marginTop: 16,
        flexDirection: "column",
        paddingBottom: 42,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ExtendedForecastLeftContainer: {
        flex: 1,
        padding: 24,
        
    },
    btnLikeExtendedForecastContainer: {
        marginBottom: 12,
        width: 56,
        height: 56,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10, //applied to container, And this is for inside
        //elevation: 10,
    },
    imgLikeExtendedForecast: {
        height: 32,
        width: 32,
    },
    ExtendedForecastRightContainer: {
        flex: 4,
        paddingTop: 0,
        paddingLeft: 32,
        paddingRight: 32,
        flexDirection: "column",
    },
    textHeadingExtendedForecast: {
        color: '#000000',
        fontSize: 20,
        lineHeight: 24,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontFamily: 'CircularStd-Bold'
    },
    textContentExtendedForecast: {
        color: '#000000',
        //fontWeight: '100',
        fontSize: 16,
        lineHeight: 24,
        opacity: 0.5,
        textAlignVertical: 'center',
        fontFamily: 'CircularStd-Book',
        textAlign: 'center',
    },
    ShareThisForecastContainer: {
        flex: 1,
        padding: 24,
        flexDirection: "row",
    },

    btnShareThisForecast: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#025E4C',
        padding: 24,
    },
    imgShare: {
        height: 18.4,
        width: 19.3,
        marginRight: 10
    },
    textShareThisForecast: {
        color: '#ffffff',
        fontSize: 16,
        lineHeight: 20,
        fontFamily: 'CircularStd-Medium',
        textAlignVertical: 'center',
    },

    feedbackContainer: {
        flex: 1,
        padding: 16,
        paddingTop: 5,
        marginBottom: 80,
        
    },
    
    feedbackblock:{
        backgroundColor: '#f7f7f7',
        padding: 16,
        flexDirection: "row",
        borderRadius: 16,
    },


    feedbackLeftContainer: {
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    feedbackRightContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexDirection: 'row'
    },

    feedbackbtn1:{
        padding: 16,
        backgroundColor: '#FFE3E1',
        borderRadius: 100,
        marginRight: 16,
    },

    feedbackbtn2:{
        padding: 16,
        backgroundColor: '#CBF7E0',
        borderRadius: 100,
    },


    textFeedback: {
        color: '#000000',
        //fontWeight: 'bold',
        fontSize: 16,
        lineHeight: 20,
        fontFamily: 'CircularStd-Bold',
        textAlignVertical: 'center',
    },
    textFeedbackDate: {
        color: '#000000',
        //fontWeight: '300',
        fontSize: 12,
        fontFamily: 'CircularStd-Bold',
        lineHeight: 15,
        opacity: .4,
    },
    imgDislike: {
        height: 20,
        width: 20,
    
        transform: [{ rotate: '180deg' }],
    },

    imglikethis: {
        height: 30,
        width: 20,   
    },
    imgincois: {
        height: 22,
        width: 74,  
    },
    imgRF: {
        height: 29.5,
        width: 79.5,  
    },
    logos: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        padding:10,
        justifyContent: 'space-between',
        paddingRight:70,
        paddingLeft:70,

        
    },
    textlogo:{
        color:'#939294',
        fontFamily: 'CircularStd-Bold',
        fontSize:12,
    },

    bottomLastContainer: {
        flex: 1,
        height: '5%',
        flexDirection: "row",
        //backgroundColor: 'yellow'
    },
    bottomLastLeftContainer: {
        flex: 1,
        //padding: 16,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomLastRightContainer: {
        flex: 1,
        //padding: 16,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnBottomLastContainer: {
        flexDirection: 'row',
        height: '80%',
        borderRadius: 70,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        backgroundColor: 'skyblue'
    },
    textBottomLast: {
        color: '#000000',
        //fontWeight: 'bold',
        fontSize: 12,
        fontFamily: 'CircularStd-Bold',
        lineHeight: 22,
        textAlignVertical: 'center',
    },


    //for Raw Bottom Sheet
    RBSheetMainContainer: {
        flex: 1,
        //height: 1000,
        flexDirection: "column",
        //backgroundColor: 'green',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingBottom: 10
    },
    SearchHeaderContainer: {
        /*height: 80, */
        width: '100%',
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24
    },
    InputSearchBar: {
        /*height: 50, */width: '100%',
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center', paddingLeft: 5,
        padding: 5,
        justifyContent: 'space-between'
    },
    PlaceholderInput: {
        fontSize: 18,
        lineHeight: 23,
        fontFamily: 'CircularStd-Book',
        marginLeft: 10
    },
    SearchBarImage: {
        height: 30,
        width: 30,
        transform: [{ rotate: '90deg' }]
    },
    textNearByLocation: {
        fontFamily: 'CircularStd-Bold',
        opacity: .52,
        letterSpacing: 1.2,
        color: '#0a0a14',
        lineHeight: 15,
        fontSize: 12,
        margin: 15
    },
    textFlatlistCenterName: {
        fontFamily: 'CircularStd-Bold',
        lineHeight: 23,
        fontSize: 18,
        color: '#000000',
        //padding: 15 
    },
    FlatListContainer: {
        //height: 100,
        paddingTop: 5,
        paddingBottom: 5,
        flexDirection: "row",
        borderRadius: 16
    },
    FlatlistSituationIconContainer: {
        //flex: 1,
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    FlatlistNameContainer: {
        //flex: 3,
        width: '50%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    FlatlistTickOnClickContainer: {
        //flex: 1,
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor:'yellow'
    },
    imgLikeNearByLocations: {
        height: 20,
        width: 20,
    },
    textDistanceFromLocation: {
        fontFamily: 'CircularStd-Bold',
        lineHeight: 20,
        fontSize: 16,
        color: '#03866d',
        //padding: 15 
    },
    imgRightTickOnSelection: {
        height: 36,
        width: 36,
    },
    continueContainer: {
        //flex: 1,
        height: 64,
        paddingLeft: 16,
        paddingRight: 16,
        flexDirection: "row",
        //backgroundColor: 'yellow'
    },
    btnContinue: {
        flex: 1,
        flexDirection: 'row',
        //height: 64,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#045546',
        padding: 16,
        //elevation: 16,
    },
    textContinue: {
        color: '#ffffff',
        //fontWeight: 'bold',
        fontSize: 18,
        lineHeight: 22,
        fontFamily: 'CircularStd-Bold',
        textAlignVertical: 'center',
    },

    containerPFZ: {
        flexDirection: "column",
        flex: 1,
        width: '100%',
        paddingRight:30,
        paddingLeft:30,
    },

    PFZmainContainer:{
        paddingTop: 20,
        flexDirection: "row",
        flex:1,
        justifyContent: 'space-between',
        paddingLeft:50,
        backgroundColor: top_container_colour,  
    },
    
    PFZdistanceContainer:{
        alignItems: 'flex-start',
        flex:1,
    },

    PFZdirection:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between', 
        paddingRight:20,
        paddingLeft:20,
        justifyContent:"center"
        
    },

    PFZtext: {
        color: '#fff',
        fontSize: 26,
        fontFamily: "CircularStd-Bold",

    },
    PFZtextone: {
        color: '#fff',
        fontSize: 16,
        fontFamily: "CircularStd-Bold",
        alignContent:"center",
    },
    PFZtextonetwo:{
        color: '#fff',
        fontSize: 26,
        fontFamily: "CircularStd-Bold",
        alignContent:"center",
    },

    PFZtexttwo: {
        color: '#fff',
        fontSize: 30,
        fontFamily: "CircularStd-Bold",

    },
    bearing:{
        opacity:0.5,
        alignItems:'center',
        justifyContent:'center',
    }
});