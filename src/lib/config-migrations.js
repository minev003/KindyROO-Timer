// The actual migration implementations
//
// note: Никога не използвайте инстантиатора тук. Това може да доведе до
//       непридвидими резултати.
//
'use strict';

module.exports.arr = [
    // Migration 001. This is void migration.
    function m001(config) {
        return config;
    },

    /**
     * Migration Nr. 002
     * @param config {Object}
     */
    function m002(config) {
        // Add new properties to commonSettings
        config['commonSettings']['timezone'] = 'Europe/Sofia';
    },


    // Migration: 003
    // Добавя нови свойства на Radio обектите
    // Премахва RedundancyUnit.switchGroup
    function m003(config) {
        const rg_count = config['radioGateways'].length;
        for (let i = 0; i < rg_count; ++i) {
            const rg = config['radioGateways'][i];

            const radio_count = rg['radios'].length;
            for (let k = 0; k < radio_count; ++k) {
                const radio = rg['radios'][k];

                // add new properties
                radio['ruRef'] = {_ref_: 0};
                radio['ruSwitchGroup'] = null;
                radio['ruPort'] = null;
            }
        }

        const ru_count = config['redundancyUnits'].length;
        for (let i = 0; i < ru_count; ++i) {
            const ru = config['redundancyUnits'][i];
            delete ru['switchGroups'];
        }
    },


    // Migration: 004
    // Add description fields to some objects
    function m004(config) {
        // repos
        const repo_count = config['commonSettings']['repos'].length;
        for (let i = 0; i < repo_count; ++i) {
            const r = config['commonSettings']['repos'][i];
            r['description'] = '';
        }

        // SipRadio
        const sip_radios_count = config['sipRadios'].length;
        for (let i = 0; i < sip_radios_count; ++i) {
            const r = config['sipRadios'][i];
            r['description'] = '';
        }

        // SipPhone
        const sip_phones_count = config['sipPhones'].length;
        for (let i = 0; i < sip_phones_count; ++i) {
            const r = config['sipPhones'][i];
            r['description'] = '';
        }

        // SipOther
        const sip_others_count = config['sipOthers'].length;
        for (let i = 0; i < sip_others_count; ++i) {
            const r = config['sipOthers'][i];
            r['description'] = '';
        }

        // RG
        const radio_gateway_count = config['radioGateways'].length;
        for (let i = 0; i < radio_gateway_count; ++i) {
            const r = config['radioGateways'][i];
            r['description'] = '';
        }

        // Radio
        for (let i = 0; i < radio_gateway_count; ++i) {
            const r = config['radioGateways'][i];
            for (let p = 0; p < r['radios'].length; ++p) {
                let d = r['radios'][p];
                d['description'] = '';
            }

        }

        // MG
        const media_gateway_count = config['mediaGateways'].length;
        for (let i = 0; i < media_gateway_count; ++i) {
            const r = config['mediaGateways'][i];
            r['description'] = '';
        }

        // Phone
        for (let i = 0; i < media_gateway_count; ++i) {
            const r = config['mediaGateways'][i];
            for (let p = 0; p < r['phones'].length; ++p) {
                let phones = r['phones'][p];
                phones['description'] = '';
            }
        }

        // RU
        const ru_count = config['redundancyUnits'].length;
        for (let i = 0; i < ru_count; ++i) {
            const r = config['redundancyUnits'][i];
            r['description'] = '';
        }

        // Role
        const role_count = config['roles'].length;
        for (let i = 0; i < role_count; ++i) {
            const r = config['roles'][i];
            r['description'] = '';
        }

        // DaLinks
        for (let i = 0; i < role_count; ++i) {
            const r = config['roles'][i];
            for (let p = 0; p < r['directAccessLinks'].length; ++p) {
                const da = r['directAccessLinks'][p];
                da['sipLink']['description'] = '';
            }
        }

        // CWP
        const cwp_count = config['controllerWorkingPositions'].length;
        for (let i = 0; i < cwp_count; ++i) {
            const r = config['controllerWorkingPositions'][i];
            r['description'] = '';
        }
    },

    // Add description to DA link
    function m005(config) {
        const role_count = config['roles'];
        for (let i = 0; i < role_count.length; ++i) {
            const r = role_count[i];
            for (let p = 0; p < r['directAccessLinks'].length; ++p) {
                let d = r['directAccessLinks'][p];
                d['description'] = '';
            }

        }
    },

    // Remove sipLink from DA and RadioLinks and add SipUri, refRadio and sipRef
    function m006(config) {
        const roles = config['roles'];
        for (let i = 0; i < roles.length; ++i) {
            const r = roles[i];
            for (let p = 0; p < r['directAccessLinks'].length; ++p) {
                let d = r['directAccessLinks'][p];
                delete d['sipLink'];
                d['sipUri'] = '';
                d['sipRef'] = '';
            }
        }
    },

    // Replace empty(consisting only of white characters) role's direct access'
    // name with its default value 'direct-access'
    function m007(config) {
        const roles = config['roles'];
        for (let r = 0; r < roles.length; r++) {
            let curr_role_das = roles[r]['directAccessLinks'];
            for (let da = 0; da < curr_role_das.length; da++) {
                let curr_da = curr_role_das[da];
                if (!(/\S+/.test(curr_da.name))) {
                    curr_da.name = 'direct-access';
                }
            }
        }
    },

    // Replace empty(consisting only of white characters) role's radio link's
    // name with its default value 'radio-link'
    function m008(config) {
        const roles = config['roles'];

        for (let r = 0; r < roles.length; r++) {
            let curr_role_radios = roles[r]['radioLinks'];

            for (let radio = 0; radio < curr_role_radios.length; radio++) {
                let curr_radio = curr_role_radios[radio];

                if (!(/\S+/.test(curr_radio.name))) {
                    curr_radio.name = 'radio-link';
                }
            }
        }
    },

    // Remove the `apiKey` from the `nms` object. This is deprecated concept.
    // Umbrella now uses TLS for API exposure.
    function m009(config) {
        const nms = config['commonSettings']['nms'];

        delete nms['apiKey'];
    },

    // add model property and initialize it with default value
    function m010(config) {
        let i;

        const cwps = config['controllerWorkingPositions'];
        for (i = 0; i < cwps.length; ++i) {
            cwps[i].model = 'balkantel-rstation10-air-r1';
        }

        const mgs = config['mediaGateways'];
        for (i = 0; i < mgs.length; ++i) {
            mgs[i].model = 'unmanaged-mg';
        }

        const rgs = config['radioGateways'];
        for (i = 0; i < rgs.length; ++i) {
            rgs[i].model = 'unmanaged-rg';
        }

        const rus = config['redundancyUnits'];
        for (i = 0; i < rus.length; ++i) {
            rus[i].model = 'balkantel-rd3ru.24.6';
        }

        const sip_radios = config['sipRadios'];
        for (i = 0; i < sip_radios.length; ++i) {
            sip_radios[i].model = 'unmanaged-radio';
        }
    },

    // Add `txMulticastUri` property for all `SipRadio` and `Radio` objects.
    function m011(config) {
        // migrate sipRadios
        const sip_radios = config['sipRadios'];
        for (let i = 0; i < sip_radios.length; ++i) {
            sip_radios[i]['txMulticastUri'] = null;
        }

        // migrate analogRadios
        // analog radios lives as children of RadioGateways
        const rgs = config['radioGateways'];
        for (let i = 0; i < rgs.length; ++i) {
            let analog_radios = rgs[i]['radios'];
            for (let k = 0; k < analog_radios.length; ++k) {
                analog_radios[k]['txMulticastUri'] = null;
            }
        }
    },

    function m012(config) {
        const cs = config['commonSettings'];

        const repos = cs['repos'];
        for (let i = 0; i < repos.length; ++i) {
            // add class property
            repos[i]['_class_'] = 'ZypperRepo';
        }

        const ntp = cs['ntp'];
        for (let i = 0; i < ntp.length; ++i) {
            // rename ntp.url to ntp.host
            ntp[i]['host'] = ntp[i]['url'];
            delete ntp[i]['url'];
        }

        const cwps = config['controllerWorkingPositions'];
        for (let i = 0; i < cwps.length; ++i) {
            // add class property
            cwps[i]['_class_'] = 'Cwp';
            // add sipUri property
            // sipUri can not be empty, generate one from IP
            cwps[i]['sipUri'] = `sip:${cwps[i]['ipv4']}`;
        }

        const sipRadios = config['sipRadios'];
        for (let i = 0; i < sipRadios.length; ++i) {
            // add class property
            sipRadios[i]['_class_'] = 'SipRadio';
        }

        const sipPhones = config['sipPhones'];
        for (let i = 0; i < sipPhones.length; ++i) {
            // add class property
            sipPhones[i]['_class_'] = 'SipPhone';

            // add ipv4. ipv4 can't be empty, so generate fake one
            sipPhones[i]['ipv4'] = '192.0.2.1';
        }

        const sipOthers = config['sipOthers'];
        for (let i = 0; i < sipOthers.length; ++i) {
            // add class property
            sipOthers[i]['_class_'] = 'SipOther';
        }

        const mgs = config['mediaGateways'];
        for (let i = 0; i < mgs.length; ++i) {
            // add class property
            mgs[i]['_class_'] = 'MediaGateway';
            for (let k = 0; k < mgs[i]['phones'].length; ++k) {
                // class property for children too
                let phones = mgs[i]['phones'][k];
                phones['_class_'] = 'AnalogPhone';
            }
        }

        const rgs = config['radioGateways'];
        for (let i = 0; i < rgs.length; ++i) {
            // add class property
            rgs[i]['_class_'] = 'RadioGateway';
            for (let k = 0; k < rgs[i]['radios'].length; ++k) {
                // class property for children too
                let radios = rgs[i]['radios'][k];
                radios['_class_'] = 'AnalogRadio';
            }
        }

        const roles = config['roles'];
        for (let i = 0; i < roles.length; ++i) {
            roles[i]['_class_'] = 'Role';       // add property
            roles[i]['conferenceCalls'] = [];   // add property

            // rename directAccessLinks
            roles[i]['groundCalls'] = roles[i]['directAccessLinks'];
            delete roles[i]['directAccessLinks'];

            // rename radioLinks
            roles[i]['radioCalls'] = roles[i]['radioLinks'];
            delete roles[i]['radioLinks'];

            for (let k = 0; k < roles[i]['groundCalls'].length; ++k) {
                let gc = roles[i]['groundCalls'][k];
                // add properties
                gc['_class_'] = 'GroundCall';
                gc['button']['style'] = 'Default';

                // convert sipUri to sipLinkRef property
                gc['sipLinkRef'] = {
                    _ref_: m012_uri2ref(gc['sipUri'], config)
                };
                delete gc['sipUri'];

                // remove sipRef, it was never unused
                delete gc['sipRef'];
            }

            for (let p = 0; p < roles[i]['radioCalls'].length; ++p) {
                let rc = roles[i]['radioCalls'][p];
                // add properties
                rc['_class_'] = 'RadioCall';
                rc['description'] = '';
                rc['button']['style'] = 'Default';

                // rename radioRef
                rc['sipLinkRef'] = rc['radioRef'];
                delete rc['radioRef'];
            }
        }
    },

    function m13(config) {
        for (let i = 0; i < config['controllerWorkingPositions'].length; ++i) {
            let cwp = config['controllerWorkingPositions'][i];
            cwp['skipConfiguration'] = false;
        }
    },

    function m14(config) {
        for (let i = 0; i < config['roles'].length; ++i) {
            let curr_role = config['roles'][i];
            curr_role['layout'] = 'radis3.radio-others';
        }
    },

    // Add the recorders collection for the first time
    function m15(config) {
        config['recorders'] = [];   // add property
    },

    // Add the phone books collection for the first time
    function m16(config) {
        config['commonSettings']['phoneBooks'] = []; // add property

        // Initialize for each role
        let roles = config['roles'];
        for (let i = 0; i < roles.length; ++i) {
            let curr_role = roles[i];
            curr_role['phoneBookRefs'] = [];
        }

        // Initialize for each data
        let cwps = config['controllerWorkingPositions'];
        for (let i = 0; i < cwps.length; ++i) {
            let curr_cwp = cwps[i];
            curr_cwp['phoneBookRefs'] = [];
        }
    },


    // Add `firmware` field
    // Rem `model` field
    function m17(config) {
        const desc = {
            logicGroups: {
                1: {label: '', get: 'I_1_1_1_1', set: 'Q_1_1_1_1'},
                2: {label: '', get: 'Q_1_1_1_2', set: 'Q_1_1_1_2'},
            },
            switchGroups: {
                1: {label: 'Port 1', lg: '1'},
                2: {label: 'Port 2', lg: '1'},
                3: {label: 'Port 3', lg: '1'},
                4: {label: 'Port 4', lg: '1'},
                5: {label: 'Port 5', lg: ''},

                6: {label: 'Port 6', lg: '2'},
                7: {label: 'Port 7', lg: '2'},
                8: {label: 'Port 8', lg: '2'},
                9: {label: 'Port 9', lg: '2'},
                10: {label: 'Port 10', lg: ''},
            },
            layout: [
                ['1', '2', '3', '4', '5'],
                ['6', '7', '8', '9', '10']
            ],
            meta: {
                model: '1.0',
                label: '',
                info: 'From migration'
            }
        };
        for (let i = 0; i < config['redundancyUnits'].length; ++i) {
            let ru = config['redundancyUnits'][i];
            ru['firmware'] = desc;
            delete ru['model'];
        }
    },


    // Introduce `ruRadios` section
    function m18(config) {
        config['ruRadios'] = [];
    },

    // Add `sipUriFailOver` field for all `SipLink` objects
    function m19(config) {

        function add_field(o) {
            o['sipUriFailOver'] = null;
        }

        // First level objects
        let list = config['controllerWorkingPositions'] || [];
        list.forEach(add_field);

        list = config['sipRadios'] || [];
        list.forEach(add_field);

        list = config['sipPhones'] || [];
        list.forEach(add_field);

        list = config['sipOthers'] || [];
        list.forEach(add_field);

        // second level objects AnalogPhone AnalogRadio lives in gateways
        const mg = config['mediaGateways'] || [];
        for (let i = 0; i < mg.length; ++i) {
            list = mg[i]['phones'] || [];
            list.forEach(add_field);
        }

        const rg = config['radioGateways'] || [];
        for (let i = 0; i < mg.length; ++i) {
            list = rg[i]['radios'] || [];
            list.forEach(add_field);
        }
    },

    // remove RU related properties from AnalogRadios
    function m20(config) {
        const rgs = config['radioGateways'];
        for (let i = 0; i < rgs.length; ++i) {
            // add class property
            const gate = rgs[i];
            for (let k = 0; k < gate['radios'].length; ++k) {
                // class property for children too
                let radio = gate['radios'][k];
                delete radio['ruRef'];
                delete radio['ruPort'];
                delete radio['ruSwitchGroup'];
            }
        }
    },

    // add forbiddenTx property to RadioCalls
    function m21(config) {
        const roles = config['roles'] || [];
        for (let i = 0; i < roles.length; ++i) {
            const rc = roles[i]['radioCalls'] || [];
            for (let k = 0; k < rc.length; ++k) {
                rc[k]['forbiddenTx'] = false;
            }
        }
    },

    // add frequency and channel properties for each SIpRadio instance
    function m22(config) {
        const srs = config['sipRadios'] || [];
        for (let i = 0; i < srs.length; ++i) {
            let curr_sr = srs[i];
            curr_sr['frequency'] = '';
            curr_sr['channel'] = '';
        }
    },

    // config['sipOthers'] no longer exists as it gets replaced with
    // config['sipExt']
    function m23(config) {
        if (Object.prototype.hasOwnProperty.call(config, 'sipOthers') &&
        Array.isArray(config['sipOthers'])) {
            config['sipExt'] = config['sipOthers'];
            delete config['sipOthers'];
        }
    },

    // Add cwpUsers array
    function m24(config) {
        config['cwpUsers'] = [];
    },

    // Add dialPlans array
    function m25(config) {
        config.commonSettings['dialPlans'] = [];
    },

    // Add dialplanRefs array to Role and CWP objects
    function m26(config) {
        const roles = config['roles'] || [];
        for (let i = 0; i < roles.length; ++i) {
            roles[i]['dialplanRefs'] = [];
        }

        const wps = config['controllerWorkingPositions'] || [];
        for (let i = 0; i < wps.length; ++i) {
            wps[i]['dialplanRefs'] = [];
        }
    },

    // Add userRefs array to CWP objects
    function m27(config) {
        const wps = config['controllerWorkingPositions'] || [];
        for (let i = 0; i < wps.length; ++i) {
            wps[i]['cwpUserRefs'] = [];
        }
    },

    // Add sipProxyAccount to CWP objects
    function m28(config) {
        const wps = config['controllerWorkingPositions'] || [];
        for (let i = 0; i < wps.length; ++i) {
            wps[i]['sipProxyAccount'] = {user:'', password:''};
        }
    },

    // Add assistantPosition to CWP objects
    function m29(config) {
        const wps = config['controllerWorkingPositions'] || [];
        for (let i = 0; i < wps.length; ++i) {
            wps[i]['assistantPosition'] = {_ref_: 0};
        }
    },

    // Reconfiguration
    function m30(config) {
        // controllerWorkingPositions
        for (let i = 0; i < config['controllerWorkingPositions'].length; ++i) {
            let cwp = config['controllerWorkingPositions'][i];
            // Change sipProxyAccount to sipRegistries
            delete cwp['sipProxyAccount'];
            cwp['sipRegistries'] = []

            // Add SipCallPolicy to CWP objects
            cwp['sipCallPolicy'] = {
                incoming_other_calls: 'hold',

                outgoing_other_calls: 'hold',
                outgoing_timeout: 30,

                forward_uri: 'sip:106@voip-01.balkantel.net',
                forward_type: 'no_answer',
                forward_timeout: 30
            };

            // Add Auth to CWP objects
            cwp['is_card_required'] = false;
            cwp['admin_pin'] = '827ccb0eea8a706c4c34a16891f84e7b';

            // Add emergencyCall to CWP objects
            cwp['emergencyCall'] = "tel:112"
            // Add recorders
            cwp['recorderRefs'] = [];
        }

        // roles
        for (let i = 0; i < config['roles'].length; ++i) {
            let role = config['roles'][i];
            // Change sipProxyAccount to sipRegistries
            delete role['sipProxyAccount'];
            role['sipRegistries'] = []

            // Add display_name, tab_name, ptt_priority to Roles
            role['displayName'] = ''
            role['tabName'] = ''
            role['pttPriority'] = 0

            // Add GUI to Roles objects
            role['gui'] = {
                rows: 3,
                columns: 3
            };
        }

        // cwpUsers
        for (let i = 0; i < config['cwpUsers'].length; ++i) {
            let user = config['cwpUsers'][i];
            // Change sipProxyAccount to sipRegistries
            delete user['sipProxyAccount'];
            user['sipRegistries'] = []
        }
    },

    // Add Behavior for sip phones and links
    function m31(config) {
        const sipPhones = config['sipPhones'] || [];
        for (let i = 0; i < sipPhones.length; ++i) {
            sipPhones[i]['r2s'] = false;
            sipPhones[i]['subscribe_enable'] = false;
            sipPhones[i]['options_enable'] = true;
            sipPhones[i]['options_interval'] = 3;
        }

        const roles = config['roles'];
        for (let i = 0; i < roles.length; ++i) {
            for (let k = 0; k < roles[i]['groundCalls'].length; ++k) {
                let gc = roles[i]['groundCalls'][k];
                gc['type'] = 'sip';
                gc['group'] = 1;
                gc['auto_dial'] = 'off';
                gc['r2s'] = false;
                gc['subscribe_enable'] = false;
                gc['options_enable'] = true;
                gc['options_interval'] = 3;
            }

            for (let s = 0; s < roles[i]['conferenceCalls'].length; ++s) {
                let cc = roles[i]['conferenceCalls'][s];
                cc['type'] = 'multicast';
                cc['group'] = 2;
            }
        }
    },

    // Add sipServers array
    function m32(config) {
        config['commonSettings']['sipServers'] = [];
    }

];


// /////////////////////////////////////////////////////////////////////////////
// Helper functions. Please use the naming convention ${mig}_boom
// /////////////////////////////////////////////////////////////////////////////

// helper function for m12
function m012_uri2ref(str, config) {

    // look in sipPhones
    const sipPhones = config['sipPhones'];
    for (let i = 0; i < sipPhones.length; ++i) {
        let phone = sipPhones[i];
        if (phone['sipUri'] === str) {
            return phone['_id_'];
        }
    }

    // look in sipOthers
    const sipOthers = config['sipOthers'];
    for (let i = 0; i < sipOthers.length; ++i) {
        let phone = sipOthers[i];
        if (phone['sipUri'] === str) {
            return phone['_id_'];
        }
    }

    // look in AnalogPhones
    for (let i = 0; i < config['mediaGateways'].length; ++i) {
        let mg = config['mediaGateways'][i];
        for (let k = 0; k < mg['phones'].length; ++k) {
            let phone = mg['phones'][k];
            if (phone['sipUri'] === str) {
                return phone['_id_'];
            }
        }
    }

    // not found
    return 0;
}
