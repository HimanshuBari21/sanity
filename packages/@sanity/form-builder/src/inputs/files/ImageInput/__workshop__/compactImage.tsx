import React, {useState} from 'react'
import {useBoolean} from '@sanity/ui-workshop'
import {
  Card,
  Container,
  Stack,
  Box,
  Text,
  Button,
  Inline,
  Heading,
  MenuGroup,
  MenuButton,
  Menu,
  MenuItem,
  Tooltip,
  Flex,
  MenuDivider,
  rgba,
} from '@sanity/ui'
import {
  ChevronDownIcon,
  ChevronRightIcon,
  EditIcon,
  EllipsisVerticalIcon,
  FolderIcon,
  ImageIcon,
  PublishIcon,
  SearchIcon,
  TrashIcon,
  UploadIcon,
} from '@sanity/icons'
import styled from 'styled-components'

const RatioBox = styled(Box)`
  position: relative;
  padding-bottom: min(calc(${({ratio = 3 / 2}) => 1 / ratio} * 100%), 30vh);
  width: 100%;
  overflow: hidden;

  & > div:first-child {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex !important;
    align-items: center;
    justify-content: center;
  }

  & img {
    max-width: 100%;
    max-height: 100%;
  }
`

const Overlay = styled(Flex)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => (props.hover ? 'rgba(255, 255, 255, 0.5)' : '')};
`

const HoverOverlay = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 0, 0, 0.5);
`

export default function CompactImage(props) {
  const hasImage = useBoolean('Image', false, 'Props')
  const hover = useBoolean('Hover with file', false, 'Props')
  const assetSources = useBoolean('Asset sources', false, 'Props')

  return (
    <Container width={1}>
      <Stack space={2} marginTop={6}>
        <Text weight="semibold" size={1}>
          Image input
        </Text>
        <Card border style={{borderStyle: hasImage ? 'solid' : 'dashed'}}>
          <RatioBox>
            {hasImage && (
              <>
                <Card padding={0} tone="transparent" sizing="border">
                  <img src={'https://picsum.photos/1200/900'} />
                </Card>
                <Overlay justify="flex-end" padding={3} hover={hover}>
                  {hover && (
                    <Flex align="center" justify="center" style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}>
                      <Text>Drop file here to upload</Text>
                    </Flex>
                  )}
                  <Inline space={1}>
                    <Tooltip
                      content={
                        <Box padding={2}>
                          <Text muted size={1}>
                            Edit details
                          </Text>
                        </Box>
                      }
                    >
                      <Button mode="ghost" icon={EditIcon} />
                    </Tooltip>
                    {/* <Tooltip
                      content={(
                        <Box padding={2}>
                          <Text muted size={1}>Remove image</Text>
                        </Box>
                      )}
                    >
                      <Button mode="ghost" icon={TrashIcon} tone="critical" onClick={() => setHasImage(false)}/>
                    </Tooltip> */}
                    <MenuButton
                      id="image-menu"
                      button={<Button icon={EllipsisVerticalIcon} mode="ghost" />}
                      menu={
                        <Menu>
                          <MenuItem icon={UploadIcon} text="Upload" />
                          {!assetSources && <MenuItem icon={SearchIcon} text="Browse" />}
                          {assetSources && (
                            <MenuGroup icon={SearchIcon} text="Browse">
                              <MenuItem icon={ImageIcon} text="Media" />
                              <MenuItem icon={ImageIcon} text="Unsplash" />
                            </MenuGroup>
                          )}
                          <MenuDivider />
                          <MenuItem
                            icon={TrashIcon}
                            text="Remove"
                            tone="critical"
                            onClick={() => setHasImage(false)}
                          />
                        </Menu>
                      }
                    />
                  </Inline>
                </Overlay>
                {/* {hover && (
                  <HoverOverlay>
                    <Card tone="transparent" height="stretch" padding={4}>
                      <Text>Hover!</Text>
                    </Card>
                  </HoverOverlay>
                )} */}
              </>
            )}
            {!hasImage && (
              <Box>
                <Stack space={3}>
                  <Flex justify="center">
                    <Card padding={4} radius={2}>
                      <Stack space={3}>
                        <Flex justify="center">
                          <Heading size={3} muted>
                            <ImageIcon />
                          </Heading>
                        </Flex>
                        <Text muted>Drag or paste image here</Text>
                      </Stack>
                    </Card>
                  </Flex>

                  <Inline space={1}>
                    <Button
                      onClick={() => setHasImage(true)}
                      text="Upload"
                      mode="ghost"
                      icon={UploadIcon}
                    />
                    {!assetSources && <Button text="Browse media" mode="ghost" icon={SearchIcon} />}
                    {assetSources && (
                      <MenuButton
                        button={
                          <Button
                            text="Browse"
                            icon={SearchIcon}
                            iconRight={ChevronDownIcon}
                            mode="ghost"
                          />
                        }
                        menu={
                          <Menu icon={FolderIcon} text="Browse">
                            <MenuItem icon={ImageIcon} text="Media" />
                            <MenuItem icon={ImageIcon} text="Unsplash" />
                          </Menu>
                        }
                        portal
                        placement="left"
                      />
                    )}
                  </Inline>
                </Stack>
              </Box>
            )}
          </RatioBox>
        </Card>
      </Stack>
    </Container>
  )
}
