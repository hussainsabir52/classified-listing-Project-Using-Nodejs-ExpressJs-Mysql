const search = function(){
    var keyword=$('#search_keyword').val();
    var location=$('#search_loc').val();
    var category=$('#search_cat').val();
    var minprice=$('#search_minprice').val();
    var maxprice=$('#search_maxprice').val();

    var UrlSearch='/search?k='+keyword+'&loc='+location+'&category='+category+'&min='+minprice+'&max='+maxprice;
    window.location=UrlSearch;

}


