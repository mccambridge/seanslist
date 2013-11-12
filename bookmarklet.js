// javascript:
(function() {
    if (typeof Storage === 'undefined') {
        alert('You must use a modern web browser to use this bookmarklet. Try Chrome, Firefox or Safari.');
        return;
    }

    var data = {};

    // set defaults
    data.new = 0;

    // set initial page
    data.page = 0;

    // get current category
    data.category = window.location.pathname.split('/')[1];

    // check to see what last highest pid was
    data.lastHighest = localStorage['sjM' + data.category] || 0;

    // check for hidden items
    data.hiddenItems = localStorage['sjMHidden'].split(',') || [];
    removeHidden();

    // give initial .content div an id
    $('.content').attr('id', 'seanslist');


    // repurpose paginator //
    $('body').on('click', '.paginator a', function(e) {
        e.preventDefault();
        var $this = $(this);

        data.page++; // increment page
        $('.pagenum').text('1 - ' + (data.page + 1) + '00');

        // ajax call
        var href = '/' + data.category + '/index' + data.page + '00.html .content', // e.g. /fuo/index100.html
            $content = $('<div id="page--' + data.page + '"></div>');

        $content.appendTo('body').load(href, function() {
            // have CL help us lazy load images
            removeHidden();
            var $view = $('#toc_rows').find('.tocview').eq(0).find('a.sel');
            $view.removeClass('sel').trigger('click').addClass('sel');
        });
        $content = $('#page--' + data.page).detach();
        $('#seanslist').append($content);
    });

    // manipulate item links //
    $('#seanslist').on('click', '.row a', function(e) {
        var $this = $(this),
            $row = $this.closest('.row');
        if ($this.hasClass('i')) { // on img click, destroy
            hideForever($row.data('pid'));
            $row.remove();
            e.preventDefault();
        } else { // on text click, open in new tab
            $this.attr('target', '_blank');
        }
    });

    // click image to remove //


    // look for new posts //

    var pids = [],
        i,
        $rows = $('#toc_rows').find('.row');

    // do something with lastHighest for now
    if (data.lastHighest) {
        //alert('The last highest listing you saw in this category was: ' + data.lastHighest);
    } else { // never been here before
        //alert('You have never viewed this category before.');
        data.new = 1;
    }

    // we want more padding for highlighting, so let's just switch margin for padding
    $rows.css({'margin': 0, 'padding': '0.5em 0'});
/*
    // populate array of pids on page
    for (i = 0; i < 100; i++) {
        var pid = $rows.eq(i).data('pid');
        if (pid > data.lastHighest) {
            pids.push(pid);
        }
    }

    if (pids.length) { // only if we have some
        pids.sort().reverse(); // sort desc
        data.newest = pids[0];

        if (!data.new) { // only if user has been here before
            for (i = 0; i < pids.length; i++) {
                $rows.filter('[data-pid="' + pids[i] + '"]').css({'background': '#ffa'}); // newest one highlighted yellow, just to see if it works
            }
        }

        // save newest in this category for next time
        //localStorage['sjM' + data.category] = data.newest;
    }
*/
    function hideForever(pid) {
        data.hiddenItems.push(pid.toString());
        localStorage['sjMHidden'] = data.hiddenItems;
    }

    function removeHidden() {
        for (var i = 0; i < data.hiddenItems.length; i++) {
            $('.row[data-pid="' + data.hiddenItems[i] + '"]').css({'display': 'none'});
        }
    }

})();