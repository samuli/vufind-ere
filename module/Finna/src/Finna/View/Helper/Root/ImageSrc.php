<?php

/**
 * Get the svg and png images source address.
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
 * @package  View_Helpers
 * @author   Mika Hatakka <mika.hatakka@helsinki.fi>
 * @license  http://opensource.org/licenses/gpl-2.0.php GNU General Public License
 * @link     http://vufind.org/wiki/vufind2:developer_manual Wiki
 */
namespace Finna\View\Helper\Root;

/**
 * Get the svg and png images source address.
 *
 * @category VuFind2
 * @package  View_Helpers
 * @author   Mika Hatakka <mika.hatakka@helsinki.fi>
 * @license  http://opensource.org/licenses/gpl-2.0.php GNU General Public License
 * @link     http://vufind.org/wiki/vufind2:developer_manual Wiki
 */
class ImageSrc extends \Zend\View\Helper\AbstractHelper
{
    protected $themeInfo;

    /**
     * Constructor
     *
     * @param \VuFindTheme\ThemeInfo $themeInfo Theme information service
     */
    public function __construct(\VuFindTheme\ThemeInfo $themeInfo)
    {
        $this->themeInfo = $themeInfo;
    }

    /**
     * Return image source address. First check if svg image is found and
     * if not, then check png image.
     *
     * @param string $source image filename without extension
     *
     * @return string
     */
    public function __invoke($source)
    {
        if ($url = $this->imageFromCurrentTheme($source . '.svg')) {
            return $url;
        }
        if ($url = $this->imageFromCurrentTheme($source . '.png')) {
            return $url;
        }

        return '';

    }

    /**
     * Check if image is found in the current theme.
     *
     * @param type $image image fileanme to found
     *
     * @return mixed
     */
    protected function imageFromCurrentTheme($image)
    {
        $currentTheme = $this->themeInfo->getTheme();
        $basePath = $this->themeInfo->getBaseDir();
        $relPath = 'images/' . $image;

        $file = $basePath . '/' . $currentTheme . '/' . $relPath;
        if (file_exists($file)) {
            $urlHelper = $this->getView()->plugin('url');
            return $urlHelper('home') . 'themes/' . $currentTheme . '/' . $relPath;
        }
        return null;
    }

}
