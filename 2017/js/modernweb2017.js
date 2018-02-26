var session_table_D1 = {
    "9:00": [
        '2136', // 報到
    ],
    "9:30": [
        '2137', // Opening
    ],
    "9:40": [
        '2177', // 北村英志
    ],
    "11:00": [
        '2094', // 井村友美        
    ],
    "13:30": [
        '2123', // 高偉格
        '2152', // 李曉清        
        '2121', // 張博凱
        '2157' // 王志誠
    ],
    "13:55": [
        '2120', // 林承澤
        '2119', // 尤俊凱
        '2153', // 楊捷凱        
        '2117' // 洪毓翔
    ],
    "14:30": [
        '2127', // 徐銘谷
        '2161', // 李建杭
        '2133', // 許精
        '2130' // 蘇學翔

    ],
    "15:30": [
        '2128', // 吳俊賢
        '2134', // 吳柏毅
        '2129', // 高見龍
        '2125' // 王毅丞


    ],
    "16:20": [
        '2132', // 林佑安
        '2124', // 黃保翕
        '2167', // 
        '2162' // 
    ],
}

var session_table_D2 = {
    "9:00": [
        '2144', // 報到
    ],
    "9:30": [
        '2145', // Opening
    ],
    "9:40": [
        '2148', // 曾義峰
    ],
    "10:30": [
        '2150', // 李佳憲
    ],
    "11:20": [
        '2146', // 李維翰
    ],
    "13:30": [{
        sID: '2163', // 袁鋒
        rowspan: 2,
        track: '中國技術日',
        time: '13:40 ~ 14:20'

    }, {
        sID: '2159', // 沈劍
        rowspan: 2,
        track: '中國技術日',
        time: '13:40 ~ 14:20'
    }, {
        sID: '2116', // 邱政憲
        rowspan: 1,
        track: 'Track F',
        time: ' '

    }, {
        sID: '2156', // 鄭淳尹
        rowspan: 1,
        track: 'Track E',
        time: ' '
    }],
    "13:55": [{
        sID: '2118', // 莊兼愿
        rowspan: 1,
        track: 'Track E',
        time: ' '
    }, {
        sID: '2122', // 卓承賢
        rowspan: 1,
        track: 'Track F',
        time: ' '
    }],
    "14:30": [
        '2158', // 鐘恒
        '2168', // 趙子明
        '2131', // 彭兆蔚
        '2126' // 蘇泰安

    ],
    "15:30": [
        '2169', // 潘佳韓
        '2164', // 徐海峰        
        '2166', // 羅仲成
        '2135' // 陳鋒逸
    ],
    "16:20": [
        '2173', // 賀師俊
        '2174', // 陳斌
        '2171', // 
        '2172' // 
    ],
}

var modernweb2017 = new Vue({
    el: '#modernweb2017',
    data: {
        Session: {},
        session_table_D1: session_table_D1,
        session_table_D2: session_table_D2,
        Speaker: {},
        Sponsor: {},
        Modal_Speaker: {},
        Modal_Session: {},
        Jobs: [1, 2, 4]
    },
    computed: {
        ModalData: function() {
            var Modal_ID = this.Modal_ID;
            return this.Speaker[Modal_ID] || {}
        },
        SpeakerFilter: function() {
            var speaker = this.Speaker;
            return {
                keynote: this.filter(speaker, 'session_type', 'keynote', true),
                session: this.filter(speaker, 'session_type', 'session', true),
                featured: this.filter(speaker, 'role', '關鍵講師', true),
                china: this.filter(speaker, 'tags', 'China', true),
                normal: this.filter(this.filter(speaker, 'role', '講師', true), 'tags', 'China', false)
            }
        }
    },
    methods: {
        filter: function(data, field, value, boolean) {
            return $.grep(data, function(obj) {
                if (typeof obj[field] === 'object') {
                    return (!!~$.inArray(value, obj[field]) == boolean) ? obj : null;
                } else {
                    return ((obj[field] == value) == boolean) ? obj : null;
                }
            });
        },
        showModal: function(speaker) {
            this.Modal_Speaker = speaker;
            $('a[href="#speakerModalAgenda"]').tab('show');
            $('#speakerModal').modal('show');
        },
        showModal2: function(session) {
            this.Modal_Session = session;
            if (!!session.speaker.length) {
                $('a[href="#sessionModalAgenda"]').tab('show');
                $('#sessionModal').modal('show');
            }
        },
        arcToSpan: function(str) {
            return str.replace(/\(/igm, '<span>(').replace(/\)/igm, ')</span>');
        }
    },
    filters: {
        time: function(date) {
            var leftPadZero = function(str, n) {
                str = ('' + str);
                return Array(n - str.length + 1).join('0') + str;
            }
            if (!!date) {
                return leftPadZero(date.getHours(), 2) + ':' + leftPadZero(date.getMinutes(), 2);
            }
            return '';
        }
    },
    beforeCreate: function() {
        $.when(
            confapi.getSessionWithSpeaker(),
            confapi.getSpeakerWithSession(),
            confapi.getSponsor()
        ).then(function(session, speaker, sponsor) {
            session['0'] = {};
            modernweb2017.Session = session;
            modernweb2017.Speaker = speaker;
            modernweb2017.Sponsor = sponsor;
            return sponsor;
        }).then(function(sponsor) {
            // jobs.html
            var deferred = $.Deferred();
            if (!!~location.href.search(/jobs.html/igm)) {
                $.getJSON('https://confapi.ithome.com.tw/api/v1.3/job-list?conf_id=2073&callback=?').then(function(jobs) {
                    modernweb2017.Jobs = $.map(jobs, function(jobRowData) {
                        for (var i = 0; i < sponsor.length; i++) {
                            sponsor[i].title = sponsor[i].title.replace(/&amp;/igm, '&');
                            if (jobRowData.sponsor_id == sponsor[i].vendor_id) {
                                jobRowData.sponsor = sponsor[i];
                                break;
                            }
                        }
                        if (!!jobRowData.sponsor) {
                            return jobRowData;
                        }
                    });
                    deferred.resolve('');
                }.bind(this));
            } else {
                deferred.resolve('');
            }
            return deferred.promise();
        }).then(function() {
            modernweb2017.$nextTick(function() {
                $('body').addClass('is-active');
                setTimeout(function() {
                    $('#loading').remove();
                }, 500);
                $.when([
                    $.getScript('https://connect.facebook.net/zh_TW/all.js'),
                    $.getScript('https://maps.googleapis.com/maps/api/js?sensor=false')
                ]).then(function() {
                    $.getScript('js/app.js');
                });
            });
        });
    }
});