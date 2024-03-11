'use strict';

/**
 * ansible list inventory implementation.
 * @constructor
 */
function AnsibleInventory() {
    this._skeleton = {
        _meta: {
            hostvars: {}
        },

        // Contains all host in FLAT form. Also parent of all groups
        all: {
            children: ['ungrouped'],
            vars: {}
        },

        // special group for ungrouped hosts
        ungrouped: {
            hosts: [],
            vars: {}
        }
    }
}


/**
 * Add group or groups  if not exist.
 * @param {String|Array.<String>} group - Group name
 */
AnsibleInventory.prototype.addGroup = function (group) {
    if (Array.isArray(group)) {
        group.forEach(function (i) {
            this.addGroup(i)
        }, this);

        return;
    }

    if (this._skeleton[group] === undefined) {
        this._skeleton[group] = {
            hosts: [],
            vars: {},
            children: []
        };

        // all groups must be child's of 'ALL'
        this.addGroupChild('all', group);
    }
};


/**
 * Add group variables. If the group does not exist will be created.
 * If variables already exist will be overloaded
 *
 * @param {String} group - name of the group
 * @param {Object|Map} vars - Map of key:value witch will be added as group
 * variables
 */
AnsibleInventory.prototype.addGroupVars = function (group, vars) {
    if (typeof vars !== 'object') {
        return;
    }

    // ensure Group existence
    this.addGroup(group);

    const gr_vars = this._skeleton[group].vars;
    Object.keys(vars).forEach(function (k) {
        gr_vars[k] = vars[k];
    })
};


/**
 * Add child to group
 * @param {String} group
 * @param {String | Array.<String>} child
 */
AnsibleInventory.prototype.addGroupChild = function (group, child) {
    // ensure Group existence
    this.addGroup(group);

    if (Array.isArray(child)) {
        child.forEach(function (i) {
            this.addGroupChild(group, i)
        }, this);

        return;
    }

    if (this._skeleton[group].children.indexOf(child) === -1) {
        this._skeleton[group].children.push(child);
    }
};


/**
 * Add hosts to group. If the group does not exist will be created.
 * If NULL is used as group name the hosts will be added in "ungrouped" group.
 *
 * @param {String|null} group - name of the group
 * @param {String | Array.<String>} host - host name or list of host names
 */
AnsibleInventory.prototype.addHost = function (group, host) {
    // for orphans cares 'ungrouped'
    if (group === null) {
        group = 'ungrouped'
    }

    // ensure Group existence
    this.addGroup(group);

    if (Array.isArray(host)) {
        host.forEach(function (i) {
            this.addHost(group, i)
        }, this);

        return;
    }

    if (this._skeleton[group].hosts.indexOf(host) === -1) {
        this._skeleton[group].hosts.push(host);

        // `ansible-inventory --list` generates empty vars for every host, so we too
        this.addHostVars(host, {});
    }
};


/**
 * Add host variables.
 *
 * @param {String} host - name of the host
 * @param {Object|Map} vars - Map of key:value witch will be added as host
 * variables
 */
AnsibleInventory.prototype.addHostVars = function (host, vars) {
    if (typeof vars !== 'object') {
        return;
    }

    // add the host into META if not exists
    if (this._skeleton._meta.hostvars[host] === undefined) {
        this._skeleton._meta.hostvars[host] = {};
    }

    const host_vars = this._skeleton._meta.hostvars[host];
    Object.keys(vars).forEach(function (k) {
        host_vars[k] = vars[k];
    })
};


/**
 * Add host alias in group. If the group dies not exist, will be created.
 * If NULL is used as group name the hosts will be added in "ungrouped" group.
 *
 * @param {String|null} group - name of the group
 * @param {String} alias - hostname
 * @param {String} hostIp - IP used for `ansible_host`
 * @param {Number?} hostPort - port used for `ansible_port`
 */
AnsibleInventory.prototype.addAlias = function (group, alias, hostIp, hostPort) {

    this.addHost(group, alias);
    this.addHostVars(alias, {
        ansible_host: hostIp,
        ansible_port: hostPort || 22
    });
};


/**
 * Return JSON representation of the inventory.
 * @param {boolean} [beauty]
 * @return {string}
 */
AnsibleInventory.prototype.toJSON = function (beauty) {
    return JSON.stringify(this._skeleton, null, beauty ? 4 : 0);
};


module.exports = AnsibleInventory;
