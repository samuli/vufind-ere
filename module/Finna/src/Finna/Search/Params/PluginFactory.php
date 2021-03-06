<?php
/**
 * Search params plugin factory
 *
 * PHP version 5
 *
 * Copyright (C) The National Library of Finland 2015.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 2,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 *
 * @category VuFind2
 * @package  Search
 * @author   Samuli Sillanpää <samuli.sillanpaa@helsinki.fi>
 * @license  http://opensource.org/licenses/gpl-2.0.php GNU General Public License
 * @link     http://vufind.org/wiki/vufind2:record_drivers Wiki
 */
namespace Finna\Search\Params;
use Zend\ServiceManager\ServiceLocatorInterface;

/**
 * Search params plugin factory
 *
 * @category VuFind2
 * @package  Search
 * @author   Samuli Sillanpää <samuli.sillanpaa@helsinki.fi>
 * @license  http://opensource.org/licenses/gpl-2.0.php GNU General Public License
 * @link     http://vufind.org/wiki/vufind2:record_drivers Wiki
 */
class PluginFactory extends \VuFind\Search\Params\PluginFactory
{
    /**
     * Create a service for the specified name.
     *
     * @param ServiceLocatorInterface $serviceLocator Service locator
     * @param string                  $name           Name of service
     * @param string                  $requestedName  Unfiltered name of service
     *
     * @return object
     */
    public function createServiceWithName(ServiceLocatorInterface $serviceLocator,
        $name, $requestedName
    ) {
        $options = $serviceLocator->getServiceLocator()
            ->get('VuFind\SearchOptionsPluginManager')->get($requestedName);

        if ($name === 'solr') {
            // Clone the options instance in case caller modifies it:
            return new \Finna\Search\Solr\Params(
                clone($options),
                $serviceLocator->getServiceLocator()->get('VuFind\Config')
            );
        } else if ($name === 'primo') {
            // Clone the options instance in case caller modifies it:
            return new \Finna\Search\Primo\Params(
                clone($options),
                $serviceLocator->getServiceLocator()->get('VuFind\Config')
            );
        } else if ($name === 'combined') {
            // Clone the options instance in case caller modifies it:
            return new \Finna\Search\Combined\Params(
                clone($options),
                $serviceLocator->getServiceLocator()->get('VuFind\Config')
            );
        }

        return parent::createServiceWithName(
            $serviceLocator, $name, $requestedName
        );
    }
}
